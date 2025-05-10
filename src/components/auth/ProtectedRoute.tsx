
import React from 'react';
import { Outlet } from 'react-router-dom';

// This component no longer checks authentication, it just renders the outlet
const ProtectedRoute = () => {
  return <Outlet />;
};

export default ProtectedRoute;
