import { Modal, List, Spin, Button, Skeleton } from "antd";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInvitations, acceptInvitation, rejectInvitation } from "../../../api/Teams/team-invite";
import { useToast } from "../../ToastContext";

interface Invitation {
  id: string;
  teamName: string;
  senderName?: string;
  // Add other invitation properties as needed
}

const InvitationsModal = ({ isVisible, onClose, userId }: { 
  isVisible: boolean; 
  onClose: () => void; 
  userId: string 
}) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Properly typed useQuery
  const { data: invitations, isPending, isError } = useQuery<Invitation[], Error>({
    queryKey: ['invitations', userId],
    queryFn: () => fetchInvitations(userId),
    enabled: isVisible && !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Typed mutations
  const { mutate: acceptMutate, isPending: isAccepting } = useMutation<void, Error, string>({
    mutationFn: (invitationId: string) => acceptInvitation(invitationId),
    onSuccess: () => {
      showToast('Invitation accepted', 'success');
      // queryClient.invalidateQueries(['invitations', userId]);
      queryClient.invalidateQueries({ queryKey: ['invitations', userId] });
    },
    onError: (error: Error) => showToast('Failed to accept invitation', 'error')
  });

  const { mutate: rejectMutate, isPending: isRejecting } = useMutation<void, Error, string>({
    mutationFn: (invitationId: string) => rejectInvitation(invitationId),
    onSuccess: () => {
      showToast('Invitation rejected', 'success');
      // queryClient.invalidateQueries(['invitations', userId]);
      queryClient.invalidateQueries({ queryKey: ['invitations', userId] });

    },
    onError: (error: Error) => showToast('Failed to reject invitation', 'error')
  });

  return (
    <Modal
      title="Invitations"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {isPending ? (
        <div className="flex justify-center">
          <Skeleton active />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load invitations</div>
      ) : invitations?.length === 0 ? (
        <div className="text-center text-gray-500">No invitations found.</div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={invitations}
          renderItem={(invitation) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  size="small"
                  loading={isAccepting}
                  onClick={() => acceptMutate(invitation.id)}
                >
                  Accept
                </Button>,
                <Button
                  danger
                  size="small"
                  loading={isRejecting}
                  onClick={() => rejectMutate(invitation.id)}
                >
                  Reject
                </Button>
              ]}
            >
              <List.Item.Meta
                title={invitation.teamName}
                description={`${invitation.senderName || 'Someone'} invited you to join team ${invitation.teamName}`}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default InvitationsModal;
