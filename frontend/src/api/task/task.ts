import apiClient from '../apiclient'; // Adjust import path
import { getUserIdFromToken } from '../auth';


export const createTask = async ({
    data,
    creatorUserId,
  }: {
    data: {
      title: string;
      description: string;
      dueDate?: string;
      assignedToId: string;
      teamId: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH';
      recurring: boolean;
      recurringFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      weeklyDay?: number;
      monthlyDay?: number;
    };
    creatorUserId: string;
  }) => {
    try {
      console.log('Data:', data);
      console.log('CreatorUserId:', creatorUserId);
      const response = await apiClient.post(`/api/tasks/create?creatorUserId=${creatorUserId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error creating task');
    }
  };

  export const fetchTasks = async ({ filterType, userId, teamId }) => {
    try {
      let url = `/api/tasks/filter?filterType=${filterType}`;
  
      if (userId) {
        url += `&userId=${userId}`;
      }
      if (teamId) {
        url += `&teamId=${teamId}`;
      }
  
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting tasks');
    }
  };
  
    
    
  export const completeTask = async (taskId) => {
    try {
      const response = await apiClient.put(`/api/tasks/${taskId}/complete`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to complete task");
    }
  };

  export const deleteTask = async (taskId) => {
    try {
      const response = await apiClient.delete(`/api/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  };