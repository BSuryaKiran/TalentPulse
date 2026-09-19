import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import adminService from '../../services/adminService';
import UserStatusBadge from '../../components/admin/UserStatusBadge';
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  Building2,
  Shield,
  Eye,
  RotateCcw,
  UserX,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';

const getRoleBadge = (role) => {
  switch (role) {
    case 'ADMIN':
      return {
        label: 'ADMIN',
        className: 'badge-admin',
        icon: <Shield size={12} style={{ marginRight: 3 }} />,
      };
    case 'RECRUITER':
      return {
        label: 'RECRUITER',
        className: 'badge-recruiter',
        icon: <Building2 size={12} style={{ marginRight: 3 }} />,
      };
    case 'JOB_SEEKER':
    default:
      return {
        label: 'JOB SEEKER',
        className: 'badge-seeker',
        icon: <UserCheck size={12} style={{ marginRight: 3 }} />,
      };
  }
};

const Users = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Status Change Modal State
  const [statusTargetUser, setStatusTargetUser] = useState(null);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState('');

  const loadUsers = () => {
    adminService
      .getUsers()
      .then((data) => {
        setUsers(data || []);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusToggle = async () => {
    if (!statusTargetUser) return;
    const newStatus = statusTargetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const updated = await adminService.updateUserStatus(
        statusTargetUser.id,
        newStatus,
        currentAdmin
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      setStatusSuccessMsg(
        `User ${updated.name} successfully ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}.`
      );
      setStatusTargetUser(null);
      setTimeout(() => setStatusSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update user status.');
      setStatusTargetUser(null);
    }
  };

  const roleTabs = [
    { label: 'All Roles', value: 'ALL' },
    { label: 'Job Seekers', value: 'JOB_SEEKER' },
    { label: 'Recruiters', value: 'RECRUITER' },
    { label: 'Admins', value: 'ADMIN' },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role Filter
      if (roleFilter !== 'ALL' && u.role !== roleFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'ALL' && u.status !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = (u.name || '').toLowerCase().includes(query);
        const matchesEmail = (u.email || '').toLowerCase().includes(query);
        const matchesTitle = (u.title || '').toLowerCase().includes(query);
        const matchesDept = (u.department || '').toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesTitle && !matchesDept) {
          return false;
        }
      }

      return true;
    });
  }, [users, roleFilter, statusFilter, searchTerm]);

  return (
    <div className="admin-users-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-subtitle">
            Inspect, manage, and verify candidate, employer recruiter, and administrative accounts.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {statusSuccessMsg && (
        <div className="alert alert-success mb-3 flex-align-center gap-2">
          <CheckCircle2 size={18} />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {/* Control Bar: Role Tabs, Status Filter, Search */}
      <div className="apps-control-bar admin-control-bar">
        <div className="control-bar-top-row">
          <div className="status-tabs">
            {roleTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setRoleFilter(tab.value)}
                className={`status-tab ${roleFilter === tab.value ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="status-select-wrapper">
            <label htmlFor="statusFilterSelect" className="control-label text-xs font-bold text-muted">
              Status:
            </label>
            <select
              id="statusFilterSelect"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control form-control-sm status-filter-dropdown"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="INACTIVE">Inactive Accounts</option>
            </select>
          </div>
        </div>

        <div className="apps-search-wrapper mt-2">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, department, or job title..."
            className="apps-search-input"
          />
        </div>
      </div>

      {/* Users Table / Cards */}
      {loading ? (
        <div className="card text-center p-5">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading platform user directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <UsersIcon size={36} />
          </div>
          <h3>No Users Found</h3>
          <p>No platform users registered yet.</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">
            <Search size={36} />
          </div>
          <h3>No Matching Users</h3>
          <p>No user accounts match your search query or selected filters.</p>
          <button
            onClick={() => {
              setRoleFilter('ALL');
              setStatusFilter('ALL');
              setSearchTerm('');
            }}
            className="btn btn-outline mt-3 flex-align-center gap-1"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="applications-table-wrapper admin-table-wrapper">
          <table className="applications-table admin-users-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Role</th>
                <th>Status</th>
                <th>Department / Title</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const roleConfig = getRoleBadge(u.role);
                const userInitial = (u.name || u.email || 'U').charAt(0).toUpperCase();

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="app-job-info admin-user-cell">
                        <div className="admin-table-avatar">{userInitial}</div>
                        <div>
                          <Link to={`/admin/users/${u.id}`} className="app-job-title-link">
                            {u.name}
                          </Link>
                          <p className="app-company-sub text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${roleConfig.className} flex-align-center inline-flex`}>
                        {roleConfig.icon}
                        <span>{roleConfig.label}</span>
                      </span>
                    </td>
                    <td>
                      <UserStatusBadge status={u.status} />
                    </td>
                    <td>
                      <div className="td-dept-cell">
                        <span className="dept-title">{u.title || 'Platform Member'}</span>
                        <span className="dept-sub text-muted text-xs">{u.department || 'General'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="td-date-text text-sm">{u.registeredDate}</span>
                    </td>
                    <td>
                      <div className="table-actions-cell flex-align-center gap-2">
                        <Link
                          to={`/admin/users/${u.id}`}
                          className="btn btn-outline btn-xs"
                          title="View Full Profile & Audit History"
                        >
                          <Eye size={13} style={{ marginRight: 4 }} />
                          <span>View Details</span>
                        </Link>
                        <button
                          onClick={() => setStatusTargetUser(u)}
                          className={`btn btn-xs ${
                            u.status === 'ACTIVE' ? 'btn-danger-outline' : 'btn-success-outline'
                          }`}
                          title={`${u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} User Account`}
                        >
                          {u.status === 'ACTIVE' ? (
                            <>
                              <UserX size={12} style={{ marginRight: 3 }} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck size={12} style={{ marginRight: 3 }} />
                              Activate
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="mobile-apps-cards admin-mobile-user-cards">
            {filteredUsers.map((u) => {
              const roleConfig = getRoleBadge(u.role);
              const userInitial = (u.name || u.email || 'U').charAt(0).toUpperCase();

              return (
                <div key={u.id} className="mobile-app-card">
                  <div className="mac-header">
                    <div className="flex-align-center gap-2">
                      <div className="admin-table-avatar">{userInitial}</div>
                      <div>
                        <h3 className="mac-title">{u.name}</h3>
                        <p className="mac-company">{u.email}</p>
                      </div>
                    </div>
                    <UserStatusBadge status={u.status} />
                  </div>

                  <div className="mac-meta mt-2">
                    <span className={`badge ${roleConfig.className}`}>
                      {roleConfig.label}
                    </span>
                    <span>{u.title}</span>
                    <span>Joined: {u.registeredDate}</span>
                  </div>

                  <div className="mac-footer flex-align-center gap-2 mt-3">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="btn btn-outline btn-sm flex-1 text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setStatusTargetUser(u)}
                      className={`btn btn-sm ${
                        u.status === 'ACTIVE' ? 'btn-danger-outline' : 'btn-success-outline'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Account Status Toggle */}
      {statusTargetUser && (
        <div className="modal-overlay" onClick={() => setStatusTargetUser(null)}>
          <div className="modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-align-center gap-2">
                <AlertTriangle
                  size={22}
                  className={statusTargetUser.status === 'ACTIVE' ? 'text-danger' : 'text-emerald'}
                />
                <h2>
                  {statusTargetUser.status === 'ACTIVE'
                    ? 'Deactivate User Account'
                    : 'Activate User Account'}
                </h2>
              </div>
              <button
                onClick={() => setStatusTargetUser(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to{' '}
                <strong>
                  {statusTargetUser.status === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE'}
                </strong>{' '}
                the platform account for <strong>{statusTargetUser.name}</strong> (
                {statusTargetUser.email})?
              </p>
              <p className="text-muted text-sm mt-2">
                {statusTargetUser.status === 'ACTIVE'
                  ? 'Deactivating will prevent this user from accessing job application and recruiter workflows.'
                  : 'Activating will restore full platform permissions for this user.'}
              </p>
              <div className="status-confirm-callout mt-3">
                <span className="text-xs text-muted">
                  Note: In development mock mode, this updates local storage state.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setStatusTargetUser(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusToggle}
                className={`btn ${
                  statusTargetUser.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'
                }`}
              >
                {statusTargetUser.status === 'ACTIVE' ? 'Confirm Deactivation' : 'Confirm Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
