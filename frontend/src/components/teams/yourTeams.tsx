// import React, { useState, useEffect } from 'react';
// import { Card, Space, Button, List, Typography, Tag, Spin, Skeleton } from 'antd';
// import { TeamOutlined, UsergroupAddOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
// import TeamCreationModal from '../modal/teams/teamCreate';
// import TeamInviteModal from '../modal/teams/teamInvite';
// import TeamDetailsModal from '../modal/teams/TeamDetailsModal';
// import { useQuery } from '@tanstack/react-query';
// import { fetchTeamsByUserId } from '../../api/Teams/team-create';
// import { getUserIdFromToken } from '../../api/auth';



// interface Team {
//   id: number;
//   name: string;
//   description: string;
//   createdById: number;
//   active: boolean;
// }

// const YourTeams = () => {
//   const [modals, setModals] = useState({ create: false, invite: false, details: false });
//   const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
//   const [creatingTeam, setCreatingTeam] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     setUserId(getUserIdFromToken());
//   }, []);

//   const { data: teams, isLoading, isFetching, isError, refetch } = useQuery({
//     queryKey: ['teams', userId],
//     queryFn: () => fetchTeamsByUserId(userId!),
//     enabled: !!userId,
//     staleTime: 5 * 60 * 1000,
//   });

//   const openModal = (type: keyof typeof modals, teamId?: string) => {
//     setModals(prev => ({ ...prev, [type]: true }));
//     if (teamId) setSelectedTeamId(teamId);
//   };

//   const closeModal = (type: keyof typeof modals) => {
//     setModals(prev => ({ ...prev, [type]: false }));
//     if (type !== 'create') setSelectedTeamId(null);
//   };

//   const handleCreateTeam = () => {
//     setCreatingTeam(true);
//     setTimeout(() => {
//       setCreatingTeam(false);
//       refetch();
//       closeModal('create');
//     }, 2000);
//   };

//   const loading = isLoading || isFetching; // Show loading on first load and refetch

//   return (
//     <div className="w-full md:w-1/2 flex-1 h-[30rem] ">
//       <Card
//         title={<Space><TeamOutlined />Your Teams</Space>}
//         extra={
//           <Space>
//             <Button icon={<ReloadOutlined />} onClick={() => {refetch}} loading={loading} />
//             <Button icon={<UsergroupAddOutlined />} onClick={() => openModal('create')} />
//           </Space>
//         }
//         className="shadow-sm rounded-lg border border-gray-200 bg-white h-full overflow-auto p-4"
//       >
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <Skeleton active />
//           </div>
//         ) : isError ? (
//           <div className="text-center text-red-500">Failed to load teams</div>
//         ) : (
//           <List
//             dataSource={teams}
//             itemLayout="horizontal"
//             renderItem={team => (
//               <List.Item
//                 key={team.id}
//                 actions={[
//                   <Button key="invite" type="link" onClick={() => openModal('invite', team.id)}>
//                     Invite Member
//                   </Button>,
//                   <Button key="details" icon={<InfoCircleOutlined />} type="text" onClick={() => openModal('details', team.id)} />
//                 ]}
//               >
//                 <List.Item.Meta
//                   avatar={<div className="bg-blue-100 p-3 rounded-full"><TeamOutlined className="text-blue-500 text-lg" /></div>}
//                   title={team.name}
//                   description={
//                     <Space direction="vertical" size={0}>
//                       <Typography.Text type="secondary">{team.description}</Typography.Text>
//                       <Typography.Text className="text-green-500">
//                         {team.createdById === userId ? 'Admin' : 'Member'}
//                       </Typography.Text>
//                     </Space>
//                   }
//                 />
//                 {team.active && <Tag color="green">Active</Tag>}
//               </List.Item>
//             )}
//           />
//         )}
//       </Card>

//       {/* Modals */}
//       <TeamCreationModal
//         visible={modals.create}
//         onCancel={() => closeModal('create')}
//         onCreate={handleCreateTeam}
//         loading={creatingTeam}
//       />
//       <TeamInviteModal
//         visible={modals.invite}
//         onCancel={() => closeModal('invite')}
//         teamId={selectedTeamId}
//       />
//       {selectedTeamId && (
//         <TeamDetailsModal
//           visible={modals.details}
//           onCancel={() => closeModal('details')}
//           teamId={selectedTeamId}
//           currentUserId={userId!}
//         />
//       )}
//     </div>
//   );
// };

// export default YourTeams;


import React, { useState, useEffect } from 'react';
import { Card, Space, Button, List, Typography, Tag, Skeleton } from 'antd';
import { TeamOutlined, UsergroupAddOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import TeamCreationModal from '../modal/teams/teamCreate';
import TeamInviteModal from '../modal/teams/teamInvite';
import TeamDetailsModal from '../modal/teams/TeamDetailsModal';
import { useQuery } from '@tanstack/react-query';
import { fetchTeamsByUserId } from '../../api/Teams/team-create';
import { getUserIdFromToken } from '../../api/auth';

interface Team {
  id: number;
  name: string;
  description: string;
  createdById: string;
  active: boolean;
}

const YourTeams = () => {
  const [modals, setModals] = useState({ create: false, invite: false, details: false });
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(getUserIdFromToken());
  }, []);

  const { data: teams, isLoading, isFetching, isError, refetch } = useQuery<Team[]>({
    queryKey: ['teams', userId],
    queryFn: () => fetchTeamsByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const openModal = (type: keyof typeof modals, teamId?: string) => {
    setModals(prev => ({ ...prev, [type]: true }));
    if (teamId) setSelectedTeamId(teamId);
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: false }));
    if (type !== 'create') setSelectedTeamId(null);
  };

  const handleCreateTeam = () => {
    setCreatingTeam(true);
    setTimeout(() => {
      setCreatingTeam(false);
      refetch();
      closeModal('create');
    }, 2000);
  };

  const loading = isLoading || isFetching; // Show loading on first load and refetch

  return (
    <div className="w-full md:w-1/2 flex-1 h-[30rem] ">
      <Card
        title={<Space><TeamOutlined />Your Teams</Space>}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={loading} />
            <Button icon={<UsergroupAddOutlined />} onClick={() => openModal('create')} />
          </Space>
        }
        className="shadow-sm rounded-lg border border-gray-200 bg-white h-full overflow-auto p-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Skeleton active />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load teams</div>
        ) : (
          <List
            dataSource={teams || []}
            itemLayout="horizontal"
            renderItem={team => (
              <List.Item
                key={team.id}
                actions={[
                  <Button key="invite" type="link" onClick={() => openModal('invite', team.id.toString())}>
                    Invite Member
                  </Button>,
                  <Button key="details" icon={<InfoCircleOutlined />} type="text" onClick={() => openModal('details', team.id.toString())} />
                ]}
              >
                <List.Item.Meta
                  avatar={<div className="bg-blue-100 p-3 rounded-full"><TeamOutlined className="text-blue-500 text-lg" /></div>}
                  title={team.name}
                  description={
                    <Space direction="vertical" size={0}>
                      <Typography.Text type="secondary">{team.description}</Typography.Text>
                      <Typography.Text className="text-green-500">
                        {team.createdById === userId ? 'Admin' : 'Member'}
                      </Typography.Text>
                    </Space>
                  }
                />
                {team.active && <Tag color="green">Active</Tag>}
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Modals */}
      <TeamCreationModal
        visible={modals.create}
        onCancel={() => closeModal('create')}
        onCreate={handleCreateTeam}
      />
      <TeamInviteModal
        visible={modals.invite}
        onCancel={() => closeModal('invite')}
        teamId={selectedTeamId}
      />
      {selectedTeamId && (
        <TeamDetailsModal
          visible={modals.details}
          onCancel={() => closeModal('details')}
          teamId={selectedTeamId}
          currentUserId={userId!}
        />
      )}
    </div>
  );
};

export default YourTeams;
