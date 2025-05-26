import React, { useEffect, useState } from 'react';
import { Modal, List, Button, Skeleton } from 'antd';
import { fetchUsersNotInTeam, sendInvite } from '../../../api/Teams/team-create';
import { getUserIdFromToken } from '../../../api/auth';
import { useToast } from '../../../components/ToastContext'; // 🔥 import useToast hook

interface TeamInviteModalProps {
  visible: boolean;
  onCancel: () => void;
  teamId: string;
}

const TeamInviteModal: React.FC<TeamInviteModalProps> = ({ visible, onCancel, teamId }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const senderId = getUserIdFromToken();

  const { showToast } = useToast(); // 🔥 use toast

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await fetchUsersNotInTeam(teamId);
      console.log('Users not in team:', users);
      setUsers(users);
    } catch (error) {
      console.error(error);
      showToast('Failed to fetch users.', 'error'); // ❌ error toast
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userId: string) => {
    if (!senderId || !teamId) {
      showToast('Invalid sender or team.', 'error'); // ❌ error toast
      return;
    }

    setInvitingUserId(userId);
    try {
      await sendInvite({
        teamId: teamId,
        senderId: senderId,
        receiverId: userId,
      });

      showToast('Invitation sent successfully!', 'success'); // ✅ success toast
      // fetchUsers(); // refresh the list
    } catch (error: any) {
      console.error('Failed to send invite:', error);
      showToast('Failed to send invitation.', 'error'); // ❌ error toast
    } finally {
      setInvitingUserId(null);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Invite Members"
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Skeleton active />
        </div>
      ) : (
        <List
          dataSource={users}
          renderItem={(user: any) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  size="small"
                  loading={invitingUserId === user.id}
                  onClick={() => handleInvite(user.id)}
                >
                  Invite
                </Button>
              ]}
            >
              <List.Item.Meta
                title={user.firstName}
                description={user.email}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default TeamInviteModal;
