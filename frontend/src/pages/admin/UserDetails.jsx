import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import adminService from '../../services/adminService';
import UserStatusBadge from '../../components/admin/UserStatusBadge';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  Building2,
  Activity,
  AlertTriangle,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

const getRoleConfig = (role) => {
  switch (role) {
    case 'ADMIN':
      return {
        label: 'ADMINISTRATOR',
        className: 'badge-admin',
        icon: <Shield size={13} style={{ marginRight: 4 }} />,
        desc: 'Full platform administration, security audit, and microservice monitoring privileges.',
      };
    case 'RECRUITER':
      return {
        label: 'RECRUITER / EMPLOYER',
        className: 'badge-recruiter',
        icon: <Building2 size={13} style={{ marginRight: 4 }} />,
        desc: 'Requisition publishing, candidate resume screening, and applicant pipeline management.',
      };
    case 'JOB_SEEKER':
    default:
      return {
        label: 'JOB SEEKER / CANDIDATE',
        className: 'badge-seeker',
        icon: <UserCheck size={13} style={{ marginRight: 4 }} />,
        desc: 'Job discovery, profile management, resume attachments, and application status tracking.',
      };
  }
};

const UserDetails = () => {
  const { id } = useParams();
  const { user: currentAdmin } = useAuth();

  const [userRecord, setUserRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    adminService
      .getUserById(id)
      .then((data) => {
        if (isMounted) {
          setUserRecord(data);
          setErrorMsg('');
        }
      })
      .catch((err) => {
        if (isMounted) setErrorMsg(err.message || 'User not found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusChange = async () => {
    if (!userRecord) return;
    const newStatus = userRecord.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const updated = await adminService.updateUserStatus(userRecord.id, newStatus, currentAdmin);
      setUserRecord(updated);
      setActionSuccessMsg(`User status successfully updated to ${newStatus}.`);
      setShowStatusModal(false);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update user status.');
      setShowStatusModal(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-user-details-page">
        <div className="card max-w-xl mx-auto my-5 p-5 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-muted">Loading user profile details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !userRecord) {
    return (
      <div className="admin-user-details-page">
        <div className="no-results-card max-w-xl mx-auto my-5 p-4 text-center">
          <div className="no-results-icon danger mb-3">
            <AlertCircle size={36} />
          </div>
          <h2>User Account Not Found</h2>
          <p className="text-muted mb-4">{errorMsg || 'The requested user account does not exist in the directory.'}</p>
          <Link to="/admin/users" className="btn btn-primary">
            <ArrowLeft size={16} style={{ marginRight: 6 }} />
            Back to User Directory
          </Link>
        </div>
      </div>
    );
  }

  const roleConfig = getRoleConfig(userRecord.role);
  const initials = (userRecord.name || userRecord.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="admin-user-details-page max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="details-top-bar mb-3">
        <Link to="/admin/users" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to User Management
        </Link>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="alert alert-success mb-3 flex-align-center gap-2">
          <CheckCircle2 size={18} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="details-header-card admin-user-header-card mb-4">
        <div className="admin-detail-avatar-box">{initials}</div>

        <div className="dh-main">
          <div className="dh-title-row">
            <h1 className="dh-job-title">{userRecord.name}</h1>
            <UserStatusBadge status={userRecord.status} />
          </div>

          <p className="dh-company-name flex-align-center gap-2">
            <span className={`badge ${roleConfig.className} inline-flex`}>
              {roleConfig.icon}
              <span>{roleConfig.label}</span>
            </span>
            <span className="text-muted">&bull;</span>
            <span className="text-muted text-sm">{userRecord.title || 'Platform Member'}</span>
          </p>

          <div className="dh-meta-grid mt-2">
            <div className="dh-meta-item">
              <Mail size={15} />
              <span>{userRecord.email}</span>
            </div>
            <div className="dh-meta-item">
              <Phone size={15} />
              <span>{userRecord.phone || 'Not Specified'}</span>
            </div>
            <div className="dh-meta-item">
              <MapPin size={15} />
              <span>{userRecord.location || 'San Francisco, CA'}</span>
            </div>
            <div className="dh-meta-item">
              <Calendar size={15} />
              <span>Member Since: {userRecord.registeredDate}</span>
            </div>
          </div>
        </div>

        {/* Action Button Sidebar */}
        <div className="dh-apply-widget">
          <div className="admin-action-box">
            <span className="asb-label">Account Action:</span>
            <button
              onClick={() => setShowStatusModal(true)}
              className={`btn btn-block btn-sm mt-2 ${
                userRecord.status === 'ACTIVE' ? 'btn-danger-outline' : 'btn-success-outline'
              }`}
            >
              {userRecord.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
            </button>
            <span className="text-xs text-muted mt-2 block">
              Reference: #{userRecord.id}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left (Account Profile Details) / Right (Role Permissions & Activity) */}
      <div className="application-details-grid">
        {/* Left Column */}
        <div className="app-details-left-col">
          {/* Profile Overview Card */}
          <div className="card app-info-card mb-4">
            <div className="card-header flex-align-center gap-2">
              <Briefcase size={18} className="text-indigo" />
              <h2 className="card-title text-md">Profile & Account Specifications</h2>
            </div>
            <div className="card-body">
              <div className="info-key-value-grid">
                <div className="ikv-item">
                  <span className="ikv-label">Full Legal Name:</span>
                  <span className="ikv-value">{userRecord.name}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Email Address:</span>
                  <span className="ikv-value">{userRecord.email}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Department / Unit:</span>
                  <span className="ikv-value">{userRecord.department || 'General'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Designated Title:</span>
                  <span className="ikv-value">{userRecord.title || 'Platform Member'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Affiliated Company:</span>
                  <span className="ikv-value">{userRecord.company || 'TalentPulse Network'}</span>
                </div>
                <div className="ikv-item">
                  <span className="ikv-label">Last Login / Activity:</span>
                  <span className="ikv-value">{userRecord.lastActive || 'Recently'}</span>
                </div>
              </div>

              {/* Bio Summary */}
              {userRecord.bio && (
                <div className="submitted-notes-section mt-4">
                  <label className="section-mini-label">Professional Summary & Bio:</label>
                  <div className="submitted-notes-box">
                    <p>{userRecord.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Role Permissions & Audit */}
        <div className="app-details-right-col">
          {/* Role Entitlements */}
          <div className="card mb-4">
            <div className="card-header flex-align-center gap-2">
              <Shield size={18} className="text-indigo" />
              <h2 className="card-title text-md">RBAC Entitlements & Role Policy</h2>
            </div>
            <div className="card-body">
              <p className="text-sm text-muted mb-3">{roleConfig.desc}</p>
              <div className="role-permissions-list">
                <div className="permission-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span>Interactive Workspace Access</span>
                </div>
                <div className="permission-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span>JWT Token Bearer Authentication</span>
                </div>
                <div className="permission-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span>Profile Attachment & Management</span>
                </div>
                {userRecord.role === 'ADMIN' && (
                  <>
                    <div className="permission-item">
                      <CheckCircle2 size={15} className="text-purple" />
                      <span>Platform User Status Activation</span>
                    </div>
                    <div className="permission-item">
                      <CheckCircle2 size={15} className="text-purple" />
                      <span>Microservices Gateway Health Audit</span>
                    </div>
                  </>
                )}
                {userRecord.role === 'RECRUITER' && (
                  <div className="permission-item">
                    <CheckCircle2 size={15} className="text-blue" />
                    <span>Job Requisition Creation & Applicant Screening</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Count Card */}
          <div className="card mb-4">
            <div className="card-header flex-align-center gap-2">
              <Activity size={18} className="text-indigo" />
              <h2 className="card-title text-md">Audit & Engagement History</h2>
            </div>
            <div className="card-body">
              <div className="engagement-metric-box">
                <span className="eng-count">{userRecord.activityCount || 15}</span>
                <span className="eng-label">Platform Events Logged</span>
              </div>
              <p className="text-xs text-muted text-center mt-2">
                All platform actions performed under this user are archived for compliance and audit logging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-align-center gap-2">
                <AlertTriangle
                  size={22}
                  className={userRecord.status === 'ACTIVE' ? 'text-danger' : 'text-emerald'}
                />
                <h2>
                  {userRecord.status === 'ACTIVE'
                    ? 'Deactivate User Account'
                    : 'Activate User Account'}
                </h2>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Confirm setting account status to{' '}
                <strong>{userRecord.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}</strong> for{' '}
                <strong>{userRecord.name}</strong> ({userRecord.email})?
              </p>
              <p className="text-muted text-sm mt-2">
                This will immediately update local state for this platform user.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusChange}
                className={`btn ${
                  userRecord.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'
                }`}
              >
                Confirm Status Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
