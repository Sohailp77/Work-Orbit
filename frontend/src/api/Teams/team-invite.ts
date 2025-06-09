// import axios from 'axios';
// import { BASE_URL } from '../apiConfig';

// // Helper function to get auth headers
// const getAuthHeaders = () => {
// const token = localStorage.getItem('authToken');
//   return {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//   };
// };

// // Fetch pending invitations
// export const fetchInvitations = async (userId: string) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/api/invitations/pending/${userId}`, {
//       headers: getAuthHeaders(),
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching invitations:', error);
//     throw error;
//   }
// };

// // Accept invitation
// export const acceptInvitation = async (inviteId: string) => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/api/invitations/accept/${inviteId}`, 
//         null, // no body
//         { headers: getAuthHeaders() } // headers properly sent here
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error accepting invitation:', error);
//       throw error;
//     }
//   };

//   // Reject invitation
//   export const rejectInvitation = async (inviteId: string) => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/api/invitations/reject/${inviteId}`, 
//         null, 
//         { headers: getAuthHeaders() }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error rejecting invitation:', error);
//       throw error;
//     }
//   };


// invitationsApi.ts
import apiClient from '../apiclient'; // adjust the path if needed
import axios from 'axios';
import { BASE_URL } from '../apiConfig'; // adjust path as needed

// Fetch pending invitations
export const fetchInvitations = async (userId: string) => {
  try {
    const response = await apiClient.get(`/api/invitations/pending/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching invitations');
  }
};

// Accept invitation
export const acceptInvitation = async (inviteId: string) => {
  try {
    const response = await apiClient.put(`/api/invitations/accept/${inviteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error accepting invitation');
  }
};

// Reject invitation
export const rejectInvitation = async (inviteId: string) => {
  try {
    const response = await apiClient.put(`/api/invitations/reject/${inviteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error rejecting invitation');
  }
};

export const getTeams = async () => {
  try {
    const response = await apiClient.get(`/api/teams/All`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.message || 'Error Getting teams');
  }
};


// export const getTeams = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/api/teams/All`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Error getting teams');
//   }
// };