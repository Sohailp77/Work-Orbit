// // src/api/auth.ts
// import axios from 'axios';
// import  { jwtDecode } from 'jwt-decode';
// import { BASE_URL } from './apiConfig';

// const API_URL =  BASE_URL + '/api/auth';

// export const loginUser = async (credentials: { email: string; password: string }) => {
//     const response = await axios.post(`${API_URL}/login`, credentials)
//     return response.data;
//   };
  
  

// export const registerUser = async (data :{name:string; email:string; password:string;}) => {
//   const response=await axios.post(`${API_URL}/register`, data)
//   return response.data;
// };

// export function isTokenExpired(token: string): boolean {
//     try {
//       const decoded: any = jwtDecode(token);
//       const exp = decoded.exp;
//       const now = Date.now() / 1000; // current time in seconds
//       return exp < now;
//     } catch (e) {
//       return true; // treat invalid tokens as expired
//     }
//   }

//   export function getUserIdFromToken(): string | null {
//     const token = localStorage.getItem('authToken');
//     if (!token) return null;
  
//     try {
//       const decoded: any = jwtDecode(token);
//       return decoded.userId || null;  // <-- backend has userId in claim
//     } catch (error) {
//       console.error('Failed to decode token:', error);
//       return null;
//     }
//   }

// src/api/auth.ts
import apiClient from './apiclient'; // adjust path if needed
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from './apiConfig'; // Only needed for non-authenticated APIs

const API_URL = BASE_URL + '/api/auth';

// ✅ Login User
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};

// ✅ Register User
export const registerUser = async (data: { firstName: string; email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/register', data);
  return response.data;
};

// ✅ Check if Token is Expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    const now = Date.now() / 1000; // current time in seconds
    return exp < now;
  } catch (e) {
    return true; // treat invalid tokens as expired
  }
}

// ✅ Extract User ID from Token
export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.userId || null; // <-- backend has userId in claim
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}
