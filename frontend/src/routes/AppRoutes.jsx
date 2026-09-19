import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import JobSeekerLayout from '../layouts/JobSeekerLayout';
import RecruiterLayout from '../layouts/RecruiterLayout';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import Dashboard from '../pages/jobseeker/Dashboard';
import Jobs from '../pages/jobseeker/Jobs';
import JobDetails from '../pages/jobseeker/JobDetails';
import MyApplications from '../pages/jobseeker/MyApplications';
import Profile from '../pages/jobseeker/Profile';
import EditProfile from '../pages/jobseeker/EditProfile';

import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import RecruiterProfile from '../pages/recruiter/RecruiterProfile';
import ManageJobs from '../pages/recruiter/ManageJobs';
import Applicants from '../pages/recruiter/Applicants';

import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Public Authentication Routes using MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Protected Job Seeker Portal Routes using JobSeekerLayout */}
        <Route element={<RoleRoute allowedRoles={['JOB_SEEKER']} />}>
          <Route element={<JobSeekerLayout />}>
            <Route path="/job-seeker" element={<Navigate to="/job-seeker/dashboard" replace />} />
            <Route path="/job-seeker/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/job-seeker/jobs" element={<Navigate to="/jobs" replace />} />
            <Route path="/job-seeker/jobs/:id" element={<JobDetails />} />
            <Route path="/job-seeker/applications" element={<MyApplications />} />
            <Route path="/job-seeker/profile" element={<Profile />} />
            <Route path="/job-seeker/profile/edit" element={<EditProfile />} />
          </Route>
        </Route>

        {/* Protected Recruiter Workspace Routes using RecruiterLayout */}
        <Route element={<RoleRoute allowedRoles={['RECRUITER']} />}>
          <Route element={<RecruiterLayout />}>
            <Route path="/recruiter" element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<ManageJobs />} />
            <Route path="/recruiter/applicants" element={<Applicants />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          </Route>
        </Route>

        {/* Admin Workspace Placeholder */}
        <Route element={<MainLayout />}>
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

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
