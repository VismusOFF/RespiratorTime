import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser  } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser ();

  // Проверяем, есть ли пользователь и является ли он администратором
  if (!user || user.role !== 'Администратор') {
    return <Navigate to="/signIn" />;
  }

  return children;
};

export default ProtectedRoute;
