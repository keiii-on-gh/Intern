import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './student/Dashboard';
import { InstructorDashboard } from './instructor/Dashboard';
import { CoordinatorDashboard } from './coordinator/Dashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'coordinator':
      return <CoordinatorDashboard />;
    default:
      return <div>Invalid role</div>;
  }
};
