import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../ToastContext';
import { Modal, List, Button,Spin,Skeleton,Input } from 'antd';
import { fetchTeamDetailsById,deleteTeam, exitTeam } from '../../../api/Teams/team-create'; // API call moved out
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '../../../react-query-client';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'; // Import the icons
import {TaskAssignModal} from '../TaskAssignModal';
import { completeTask,deleteTask } from '../../../api/task/task';





interface Member {
  id: string;
  userId: string;
  userName: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  createdById: string;
  members: Member[];
  active: boolean;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedToName: string;
  dueDate: string; // Assuming ISO string format for due date
  completed: boolean;
  recurring: boolean;
}



interface TeamDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  teamId: string | null;
  currentUserId: string;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ visible, onCancel, teamId, currentUserId }) => {
  


  const { showToast } = useToast();

const [isTaskModalVisible, setTaskModalVisible] = useState(false);
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
const [createdByUserId, setcreatedByUserId]= useState<String | null>(null);




  // Updated query options to handle error in the onError within the queryFn.
  const { data: team, isLoading, isError } = useQuery<Team>({
    queryKey: ['teamDetails', teamId],
    queryFn: async () => {
      try {
        return await fetchTeamDetailsById(teamId!); // Ensures the teamId is defined before calling
      } catch (error) {
        showToast('Failed to load team details', 'error'); // Error handling directly inside the queryFn
        throw error; // rethrow error to trigger isError
      }
    },
    enabled: visible && !!teamId, // Ensures it only runs when modal is visible and teamId exists
    staleTime: 5 * 60 * 1000, // Cache duration
  });

  const handleExitTeam = async () => {
    showToast('Team Exit initiated', 'error');
    if(window.confirm('Are You Sure you want to Leave this Team ?')){
      exitTeamMutation.mutate(teamId);
    }
  };

  const handleDeleteTeam = async () => {
    showToast('Team Deletion Initiated', 'error');
    if(window.confirm('Are You Sure you want to Delete this Team ?')){
      deleteTeamMutation.mutate(teamId);
    }
  };

  const exitTeamMutation=useMutation({
    mutationFn:(teamId:string) => exitTeam(teamId),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Refetch the teams list!
      onCancel();
      showToast('Team Exit Sucessfully','success')
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      showToast('Failed to Exit team.','error');
    }

  })

  const deleteTeamMutation = useMutation({
    mutationFn:(teamId:string) => deleteTeam(teamId),
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey:['teamDetails']}); // Refetch the teams list!
      onCancel();
      showToast('Team Deleted Sucessfully','success')
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      showToast('Failed to delete team.','error');
    }
  })

  const { mutate: markComplete } = useMutation({
    mutationFn: (taskId:string) => completeTask(taskId),
    onSuccess: () => {
      showToast('Task marked as complete','success');
    },
    onError: (err) => {
      showToast('Something went Wrong','error');
    },
  });


  const { mutate: removeTask, isPending: isDeletingTask } = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['teamDetails', teamId]}); // Refresh task list
      showToast('Task deleted successfully', 'success');
    },
    onError: () => {
      showToast('Failed to delete task', 'error');
    },
  });

  const isAdmin = team?.createdById === currentUserId;





const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'overdue' | 'recurring' | 'completed'>('all');



  const [searchText, setSearchText] = useState('');

  // const filteredTasks = (team?.tasks || []).filter((task: any) => {
  //   const text = searchText.toLowerCase();
  //   return (
  //     task.title?.toLowerCase().includes(text) ||
  //     task.assignedToName?.toLowerCase().includes(text)
  //   );
  // });
  

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; // e.g., '2025-05-13'
  
  const filteredTasks = (team?.tasks || []).filter((task: Task) => {
    const text = searchText.toLowerCase();
    const matchesSearch =
      task.title?.toLowerCase().includes(text) ||
      task.assignedToName?.toLowerCase().includes(text);
  
    if (!matchesSearch) return false;
  
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const dueDateStr = dueDate?.toISOString().split('T')[0]; // e.g., '2025-05-07'
  
    switch (taskFilter) {
      case 'today':
        return dueDateStr === todayStr && !task.completed;
      case 'overdue':
        return dueDateStr < todayStr && !task.completed;
      case 'recurring':
        return task.recurring === true;
      case 'completed':
        return task.completed === true;
      default:
        return true;
    }
  });
  

  return (
    <Modal
    title={team ? team.name : 'Team Details'}
    open={visible}
    onCancel={onCancel}
    footer={null}
    width="80%" // Make it wider

  >
    {isLoading ? (
      <div className="flex justify-center items-center h-[40rem]">
        <Skeleton active />
      </div>
    ) : isError || !team ? (
      <div className="text-center text-red-500 mt-10">Failed to load team details.</div>
    ) : (
      <div className="flex gap-6 h-[40rem]">
        {/* Left Section */}
        <div className="w-1/2">
          <p className="text-gray-600 mb-4">{team.description}</p>
  
          <h3 className="font-semibold">Members:</h3>
          <List
            itemLayout="horizontal"
            dataSource={team.members}
            renderItem={(member) => (
              <List.Item
                key={member.id}
                actions={[
                  <Button
                onClick={() => {
                  setcreatedByUserId(team.createdById);
                  setSelectedUserId(member.userId);
                  setTaskModalVisible(true);
                }}
              >
                Assign Task
              </Button>
                ]}
              >
                {/* <List.Item.Meta title={`${member.userName} (${member.role})`} /> */}
                <List.Item.Meta title={`${member.userName} `} />
              </List.Item>
            )}
          />
  
            <TaskAssignModal
            visible={isTaskModalVisible}
            onCancel={() => setTaskModalVisible(false)}
            teamId={team.id}
            defaultassignedToId={selectedUserId}
            defaultcreatedByid={String(createdByUserId)}  // Convert it to string explicitly
            />
          <div className="flex justify-end gap-2 mt-6">
            {isAdmin ? (
              <Button danger onClick={() => handleDeleteTeam()}>
                {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete Team'}
              </Button>
            ) : (
              <Button danger onClick={handleExitTeam}>
                Exit Team
              </Button>
            )}
          </div>
        </div>
  
        {/* Right Section */}
        <div className="w-full md:w-1/2 border-l pl-4 pr-4 overflow-auto">
    <h3 className="font-semibold mb-4">Team Tasks:</h3>

    {/* 🔥 Search Bar */}
    <Input.Search
      placeholder="Search tasks by title or assignee..."
      allowClear
      onChange={(e) => setSearchText(e.target.value)}
      value={searchText}
      className="mb-4"
    />
    <div className="mb-4 flex gap-2">
  <Button type={taskFilter === 'all' ? 'primary' : 'default'} onClick={() => setTaskFilter('all')}>
    All
  </Button>
  <Button type={taskFilter === 'today' ? 'primary' : 'default'} onClick={() => setTaskFilter('today')}>
    Today
  </Button>
  <Button type={taskFilter === 'overdue' ? 'primary' : 'default'} onClick={() => setTaskFilter('overdue')}>
    Overdue
  </Button>
  <Button type={taskFilter === 'recurring' ? 'primary' : 'default'} onClick={() => setTaskFilter('recurring')}>
    Recurring
  </Button>
  <Button type={taskFilter === 'completed' ? 'primary' : 'default'} onClick={() => setTaskFilter('completed')}>
    Completed
  </Button>
</div>


    {/* 🔥 List of Tasks */}
    <List
      itemLayout="vertical"
      dataSource={filteredTasks}
      locale={{ emptyText: 'No tasks found.' }}
      renderItem={(task: Task) => (
        <List.Item
          key={task.id}
          actions={
            isAdmin
              ? [
                  <Button
                    key="delete"
                    type="link"
                    icon={<DeleteOutlined />}
                    style={{ color: 'red' }}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        removeTask(task.id);
                      }
                    }}
                  >
                    Delete
                  </Button>,
                  <Button
                    key="complete"
                    type="link"
                    icon={<CheckCircleOutlined />}
                    style={{ color: 'green' }}
                    onClick={() => markComplete(task.id)}
                  >
                    Completed
                  </Button>,
                ]
              : []
          }
          
        >
          <List.Item.Meta
            title={
              <>
                <span className="font-medium">{task.title}</span>
                <br />
                <small>Assigned to: {task.assignedToName} </small>
                <small>
                Due Date:{' '}
                {new Date(task.dueDate).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'Asia/Kolkata', // 👈 this adjusts it to IST
                })}
                --raw data from DB
                { task.dueDate}
              </small>



              </>
            }
            description={task.description}
          />
        </List.Item>
      )}
    />
  </div>
      </div>
    )}
  </Modal>
  );
};

export default TeamDetailsModal;
