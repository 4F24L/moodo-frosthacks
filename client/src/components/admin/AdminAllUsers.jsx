/**
 * Admin All Users - User list and profile view
 */

import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks';
import UserTable from '../UserTable';
import LivePatientProfile from '../LivePatientProfile';

export default function AdminAllUsers() {
  const { getAllUsers } = useAdmin();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await getAllUsers();
        setAllUsers(users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setAllUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <LivePatientProfile 
        patient={selectedPatient} 
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <UserTable 
      patients={allUsers}
      onSelectPatient={setSelectedPatient}
    />
  );
}
