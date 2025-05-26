import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Select, Button, message } from 'antd';
import dayjs from 'dayjs';
import { createTask } from '../../api/task/task'; // your API function
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../ToastContext';
import { useQueryClient } from '@tanstack/react-query';


interface TaskAssignModalProps {
  visible: boolean;
  onCancel: () => void;
  teamId: string;
  defaultassignedToId?: string | null;
  defaultcreatedByid?: string | null;
}

export const TaskAssignModal: React.FC<TaskAssignModalProps> = ({
  visible,
  onCancel,
  teamId,
  defaultassignedToId,
  defaultcreatedByid,
}) => {
  const [form] = Form.useForm();
  const [taskType, setTaskType] = useState<'normal' | 'recurring'>('normal');

  // Setup mutation for creating the task
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTask,
  });

  const { showToast } = useToast();
  const queryClient = useQueryClient(); // 🔥 initialize queryClient


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      const recurrenceMap = {
        daily: 'DAILY',
        weekly: 'WEEKLY',
        monthly: 'MONTHLY',
      };

      const payload: any = {
        teamId,
        assignedToId: values.assignedToId,
        title: values.title,
        description: values.description,
        priority: values.priority,
      };

      const creatorUserId = defaultcreatedByid;

      if (taskType === 'normal') {
        payload.dueDate = values.dueDate.toISOString();
        payload.recurring = false;
      }
      // if (taskType === 'normal') {
      //   // Format as local datetime string without timezone conversion
      //   payload.dueDate = values.dueDate.format('YYYY-MM-DD HH:mm:ss');
      //   payload.recurring = false;
      // }
      else {
        payload.recurring = true;
        payload.recurringFrequency = recurrenceMap[values.recurringFrequency];

        if (values.recurringFrequency === 'weekly') {
          payload.weeklyDay = values.weeklyDay.toUpperCase(); // 👈 IMPORTANT CHANGE: send "MONDAY", "TUESDAY"
        }
        if (values.recurringFrequency === 'monthly') {
          payload.monthlyDay = values.monthlyDay; // 👈 Use correct field
        }
      }

      console.log('Payload to send to backend:', payload);

      // Call mutation to create task and handle success/error
      const response = await mutateAsync({
        data: payload,
        creatorUserId,
      });


      // Success notification
      showToast('Task assigned successfully!', 'success')
      console.log('Task created successfully:', response);



      queryClient.invalidateQueries({
        queryKey: ['teamDetails', teamId], // 🔥 re-fetch the team details
      });
      onCancel();
      form.resetFields();

    } catch (error) {
      console.error('Validation Failed:', error);
      showToast('Failed to assign task. Please try again.', 'error')
    }
  };

  return (
    <Modal
      title="Assign Task"
      open={visible}
      width="80%"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      <div className="flex h-[40rem]">
        {/* Left Section - Full Image */}
        <div className="w-2/3 p-2 flex items-center justify-center bg-white rounded-l-lg">
          <img
            src="https://img.freepik.com/premium-vector/business-task-management-illustration-concept-white-background_701961-9960.jpg"
            alt="Task Illustration"
          />
        </div>

        {/* Right Section - Stylish Form */}
        <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 overflow-y-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              assignedToId: defaultassignedToId,
              taskType: 'normal',
            }}
            size="middle"
            className="space-y-2"
          >
            <Form.Item
              label={<span className="text-sm font-medium">Task Type</span>}
              name="taskType"
              rules={[{ required: true, message: 'Please select task type' }]}
            >
              <Radio.Group
                onChange={(e) => setTaskType(e.target.value)}
                className="flex gap-4"
              >
                <Radio value="normal">Normal</Radio>
                <Radio value="recurring">Recurring</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium">Title</span>}
              name="title"
              rules={[{ required: true, message: 'Please enter task title' }]}
            >
              <Input placeholder="Enter task title" className="py-2" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium">Description</span>}
              name="description"
            >
              <Input.TextArea rows={2} placeholder="Enter task description" className="py-1" />
            </Form.Item>

            <Form.Item name="teamId" initialValue={teamId} hidden>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item name="assignedToId" initialValue={defaultassignedToId} hidden>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium">Priority</span>}
              name="priority"
              rules={[{ required: true, message: 'Please select task priority' }]}
            >
              <Select placeholder="Select Priority" className="text-sm">
                <Select.Option value="HIGH">High</Select.Option>
                <Select.Option value="MEDIUM">Medium</Select.Option>
                <Select.Option value="LOW">Low</Select.Option>
              </Select>
            </Form.Item>

            {taskType === 'normal' && (
              <Form.Item
                label={<span className="text-sm font-medium">Due Date</span>}
                name="dueDate"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  className="w-full py-1"
                  placeholder="Select date and time"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            )}

            {taskType === 'recurring' && (
              <div className="space-y-2">
                <Form.Item
                  label={<span className="text-sm font-medium">Recurrence Pattern</span>}
                  name="recurringFrequency"
                  rules={[{ required: true, message: 'Please select recurrence pattern' }]}
                >
                  <Select placeholder="Select Pattern" className="text-sm">
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                    <Select.Option value="monthly">Monthly</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.recurringFrequency !== curr.recurringFrequency}>
                  {({ getFieldValue }) => {
                    const recurrence = getFieldValue('recurringFrequency');
                    if (recurrence === 'weekly') {
                      return (
                        <Form.Item
                          label={<span className="text-sm font-medium">Day of Week</span>}
                          name="weeklyDay"
                          rules={[{ required: true, message: 'Please select day of week' }]}
                        >
                          <Select placeholder="Select day" className="text-sm">
                            <Select.Option value="monday">Monday</Select.Option>
                            <Select.Option value="tuesday">Tuesday</Select.Option>
                            <Select.Option value="wednesday">Wednesday</Select.Option>
                            <Select.Option value="thursday">Thursday</Select.Option>
                            <Select.Option value="friday">Friday</Select.Option>
                            <Select.Option value="saturday">Saturday</Select.Option>
                            <Select.Option value="sunday">Sunday</Select.Option>
                          </Select>
                        </Form.Item>
                      );
                    }
                    if (recurrence === 'monthly') {
                      return (
                        <Form.Item
                          label={<span className="text-sm font-medium">Day of Month</span>}
                          name="monthlyDay"
                          rules={[{ required: true, message: 'Please enter day of month' }]}
                        >
                          <Input
                            type="number"
                            min={1}
                            max={31}
                            placeholder="Enter day (1-31)"
                            className="py-1"
                          />
                        </Form.Item>
                      );
                    }
                    return null;
                  }}
                </Form.Item>
              </div>
            )}

            <Form.Item className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isPending} // shows spinner during submission
                className="h-9 text-sm font-medium"
              >
                Assign Task
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
