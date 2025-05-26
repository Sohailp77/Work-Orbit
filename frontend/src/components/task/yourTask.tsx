import { useEffect,useState  } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, Space, Button, List, Typography, Tag, Spin, Select, Skeleton } from "antd";
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { fetchTasks,completeTask } from "../../api/task/task"; // <-- your exported fetch function
import { getUserIdFromToken  } from "../../api/auth";
import { useToast } from "../ToastContext";

// adjust path according to your project

interface Task {
  id: string;
  title: string;
  priority: string;
  dueDate: string; // or Date if you handle this as a Date object
}


const { Option } = Select;

export default function YourTask() {
  const {showToast} = useToast();
  const userId=getUserIdFromToken();
  const [filterType, setFilterType] = useState('today'); // default "today"
  
  const { mutate, data: tasks = [], isPending } = useMutation({
    mutationFn: (filterType:string) => fetchTasks({ filterType, userId: userId,teamId:null }), 
    // you can pass userId dynamically later
  });

  const { mutate: markComplete } = useMutation({
    mutationFn: (taskId:string) => completeTask(taskId),
    onSuccess: () => {
      mutate(filterType); // re-fetch tasks after completion
      showToast('Task marked as complete','success');
    },
    onError: (err) => {
      showToast('Something went Wrong','error');
    },
  });
  

  // When filter changes
  const handleFilterChange = (value) => {
    setFilterType(value);
    mutate(value); // re-fetch tasks
  };

  // Fetch initial tasks
  useEffect (() => {
    mutate('today'); 
  }, []); // once on mount

  return (
    <div className="flex-1 h-[30rem]">
      <Card
        title={
          <Space>
            <CalendarOutlined />
            <span>Your Tasks</span>
          </Space>
        }
        bordered={false}
        className="shadow-sm rounded-lg border border-gray-200 bg-white h-full overflow-auto my-2"
        extra={
          <Space>
            <Select value={filterType} onChange={handleFilterChange} size="small">
              <Option value="today">Today</Option>
              <Option value="upcoming">Upcoming</Option>
              <Option value="overdue">Overdue</Option>
            </Select>
            <Button type="text" icon={<MoreOutlined />} />
          </Space>
        }
      >
        {isPending ? (
          <div className="flex justify-center items-center h-full ">
            <Skeleton />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={tasks}
            renderItem={(task:Task) => (
              <List.Item
                className="hover:bg-gray-50 px-4 py-3 rounded-lg"
                actions={[
                  <Button 
                  type="text" 
                  icon={<CheckCircleOutlined className="text-green-500" />}
                  key="complete"
                  onClick={() => markComplete(task.id)} // <--- Add this
                />
                ]}
              >
                <List.Item.Meta
                  avatar={<ClockCircleOutlined className="text-blue-500 text-lg mt-1" />}
                  title={
                    <Space>
                      <Typography.Text strong>{task.title}</Typography.Text>
                      <Tag color="orange" className="text-xs">
                        {task.priority}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Typography.Text type="secondary">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography.Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
