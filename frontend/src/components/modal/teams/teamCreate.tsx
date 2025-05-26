import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { createTeam } from '../../../api/Teams/team-create'; // API function
import { useToast } from '../../ToastContext';


const TeamCreationModal = ({ visible, onCancel, onCreate }) => {
  const { showToast } = useToast();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // API call to create team
      const newTeam = await createTeam({
        name: values.teamName,
        description: values.teamDescription,
      });

      
      // Update parent
      onCreate();

      showToast('Team created successfully!', 'success'); // ✅ success toast

      form.resetFields();
      onCancel();
    } catch (error: any) {
      console.error('Failed to create team:', error);
      showToast(error?.response?.data?.message || 'Failed to create team. Please try again.', 'error'); // ✅ error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Team"
      open={visible} // ✅ changed "visible" to "open" (latest Ant Design v5+ uses "open")
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="teamName"
          label="Team Name"
          rules={[{ required: true, message: 'Please enter the team name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="teamDescription"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TeamCreationModal;
