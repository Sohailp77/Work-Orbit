import React from 'react';
import { Modal, Button } from 'antd';

interface SessionExpireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SessionExpireModal: React.FC<SessionExpireModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  return (
    <Modal
      title="Session Expiring"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="logout" type="primary" danger onClick={onLogout}>
          Log Out
        </Button>,
      ]}
      centered
    >
      <p>Your session will expire in 30 seconds. Do you want to stay logged in?</p>
    </Modal>
  );
};

export default SessionExpireModal;
