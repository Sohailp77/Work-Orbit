import React, { useState } from 'react';
import { useTokenTimer } from '../hooks/useTokenTimer';
import SessionExpireModal from '../components/SessionExpireModal';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const [showModal, setShowModal] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login'; // Redirect to login
  };

  useTokenTimer(setShowModal);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Notification container */}

      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Session Expire Modal */}
      <SessionExpireModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}
