// src/hooks/useTokenTimer.ts
import { useEffect } from 'react';
import { isTokenExpired } from '../api/auth';
import { useNavigate } from "react-router-dom";

export const useTokenTimer = (setShowModal: (show: boolean) => void) => {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) return;

    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const exp = decoded.exp; // expiry in seconds
      const now = Date.now() / 1000; // current time in seconds
      const timeLeft = exp - now;

      if (timeLeft <= 0) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return;
      }

      // Set timeout for 30 seconds before expiry
      const warningTimeout = setTimeout(() => {
        setShowModal(true); // Show modal 30 seconds before expiry
      }, (timeLeft - 30) * 1000);

      // Set timeout for actual expiry
      const logoutTimeout = setTimeout(() => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }, timeLeft * 1000);

      // Clean timers on unmount
      return () => {
        clearTimeout(warningTimeout);
        clearTimeout(logoutTimeout);
      };
    } catch (e) {
      console.error('Invalid token format', e);
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }, [setShowModal]);
};
