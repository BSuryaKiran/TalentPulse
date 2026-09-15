import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize user role and allowed roles for comparison
  const userRole = user.role?.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

  if (!normalizedAllowedRoles.includes(userRole)) {
    // Redirect to default page for user's assigned role
    const fallbackPath =
      userRole === 'RECRUITER'
        ? '/recruiter'
        : userRole === 'ADMIN'
        ? '/admin'
        : '/job-seeker';

    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;

