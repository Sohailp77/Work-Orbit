import { message } from 'antd';
// import axios from 'axios';
// import { getUserIdFromToken } from '../auth';
// import { BASE_URL } from '../apiConfig';

// const API_URL = BASE_URL + '/api/teams';
// const userId = getUserIdFromToken();
// const token = localStorage.getItem('authToken');

// // Function to create a new team
// export const createTeam = async (teamData: { name: string, description: string }) => {
//   try {
//     const payload = {
//       ...teamData,
//       createdById: userId, // Add createdById to the request body
//     };

//     const response = await axios.post(API_URL, payload, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Error creating team');
//   }
// };

// // 🛠️ Corrected fetchTeamsByUserId
// export const fetchTeamsByUserId = async (userId: string) => {
//   try {
//     const token = localStorage.getItem('authToken');
//     const response = await axios.get(`${API_URL}/user/${userId}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Error fetching teams');
//   }
// };

// export const fetchUsersNotInTeam = async (teamId) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/auth/users?teamId=${teamId}`,{
//         headers:{
//             'Authorization' :`Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   export const sendInvite = async (payload: { teamId: string; senderId: string; receiverId: string }) => {
//     try {
//     const response = await axios.post(`${BASE_URL}/api/invitations/send`, payload ,{
//     headers:{
//         'Authorization' :`Bearer ${token}`,
//     },
//     });
//     return response.data;
//     } catch (error) {
//         console.error('Error inviting user:', error);
//     }
//   };


import apiClient from '../apiclient'; // Adjust import path
import { getUserIdFromToken } from '../auth';

export const createTeam = async (teamData: { name: string, description: string }) => {
  try {
    const payload = { ...teamData, createdById: getUserIdFromToken() };
    const response = await apiClient.post('/api/teams', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error creating team');
  }
};

export const fetchTeamsByUserId = async (userId: string) => {
  try {
    const response = await apiClient.get(`/api/teams/user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching teams');
  }
};

export const fetchUsersNotInTeam = async (teamId: string) => {
  try {
    const response = await apiClient.get(`/api/auth/users?teamId=${teamId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching users');
  }
};

export const sendInvite = async (payload: { teamId: string; senderId: string; receiverId: string }) => {
  try {
    const response = await apiClient.post(`/api/invitations/send`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error sending invite');
  }
};

export const fetchTeamDetailsById = async (teamId: string) => {
try{
  const response = await apiClient.get(`/api/teams/${teamId}`); // adjust your API path
  return response.data;
} catch (error: any) {
  throw new Error(error.response?.data?.message || 'Error sending invite');
}
};

export const deleteTeam = async (teamId:String)=>{
  try{
    const response = await apiClient.delete(`/api/teams/${teamId}`);
    return response.data;
  }catch(error:any){
    throw new Error(error.response?.data?.message || 'Error Deleting Team');
  }
};

export const exitTeam = async (teamId:String)=>{
  try{
    const userId=getUserIdFromToken();
    const response = await apiClient.delete(`/api/teams/${teamId}/exit/${userId}`)
    return response.data;
  }catch(error:any){
    throw new Error(error.response?.data?.message || 'Error Exiting Team');
  }
};
