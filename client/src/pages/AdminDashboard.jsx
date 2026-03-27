/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Sidebar, TopHeader } from '../components';
import AdminOverview from '../components/admin/AdminOverview';
import AdminAllUsers from '../components/admin/AdminAllUsers';

export default function AdminDashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isAdmin={true}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader 
          onLogout={handleLogout}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isAdmin={true}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<AdminAllUsers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
