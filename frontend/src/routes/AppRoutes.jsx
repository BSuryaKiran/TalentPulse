import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import JobSeekerLayout from '../layouts/JobSeekerLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/jobseeker/Dashboard';
import Jobs from '../pages/jobseeker/Jobs';
import JobDetails from '../pages/jobseeker/JobDetails';
import MyApplications from '../pages/jobseeker/MyApplications';
import ProfilePlaceholder from '../pages/jobseeker/ProfilePlaceholder';
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
      return <Navigate to="/job-seeker/dashboard" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes using MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Job Seeker Portal Routes using JobSeekerLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['JOB_SEEKER']} />}>
          <Route element={<JobSeekerLayout />}>
            <Route path="/job-seeker" element={<Navigate to="/job-seeker/dashboard" replace />} />
            <Route path="/job-seeker/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/job-seeker/jobs" element={<Navigate to="/jobs" replace />} />
            <Route path="/job-seeker/jobs/:id" element={<JobDetails />} />
            <Route path="/job-seeker/applications" element={<MyApplications />} />
            <Route path="/job-seeker/profile" element={<ProfilePlaceholder />} />
          </Route>
        </Route>

        {/* Recruiter Workspace Placeholder */}
        <Route element={<MainLayout />}>
          <Route
            path="/recruiter"
            element={
              <RoleRoute allowedRoles={['RECRUITER']}>
                <RecruiterDashboard />
              </RoleRoute>
            }
          />
          {/* Admin Workspace Placeholder */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
        </Route>
      </Route>

      {/* Home & Fallback Routes */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
