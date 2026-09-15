import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import JobSeekerDashboard from '../pages/dashboards/JobSeekerDashboard';
import RecruiterDashboard from '../pages/dashboards/RecruiterDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { useAuth } from '../context/useAuth';

// Smart home component redirecting based on authentication state
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role?.toUpperCase()) {
    case 'RECRUITER':
      return <Navigate to="/recruiter" replace />;
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/job-seeker" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes with Role-Based Access */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/job-seeker"
            element={
              <RoleRoute allowedRoles={['JOB_SEEKER']}>
                <JobSeekerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <RoleRoute allowedRoles={['RECRUITER']}>
                <RecruiterDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
        </Route>

        {/* Home & Fallback Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

