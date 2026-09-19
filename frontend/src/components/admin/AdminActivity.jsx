import {
  UserPlus,
  Briefcase,
  FileCheck2,
  Award,
  AlertCircle,
  ShieldCheck,
  Clock,
} from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'USER_REGISTRATION':
      return <UserPlus size={16} className="text-amber" />;
    case 'JOB_POSTED':
      return <Briefcase size={16} className="text-emerald" />;
    case 'APPLICATION_SUBMITTED':
      return <FileCheck2 size={16} className="text-blue" />;
    case 'STATUS_CHANGED':
      return <Award size={16} className="text-purple" />;
    case 'SYSTEM_AUDIT':
      return <ShieldCheck size={16} className="text-indigo" />;
    case 'JOB_CLOSED':
    default:
      return <AlertCircle size={16} className="text-muted" />;
  }
};

const AdminActivity = ({ activity }) => {
  if (!activity) return null;

  return (
    <div className="admin-activity-item">
      <div className="activity-icon-container">
        {getActivityIcon(activity.type)}
      </div>

      <div className="activity-main-content">
        <div className="activity-header-line">
          <h4 className="activity-title">{activity.title}</h4>
          <span className="activity-time">
            <Clock size={11} style={{ marginRight: 3 }} />
            {activity.timestamp}
          </span>
        </div>

        <p className="activity-description">{activity.description}</p>

        <div className="activity-footer-meta">
          <span className="activity-user-pill">{activity.user}</span>
          {activity.entityName && (
            <span className={`badge ${activity.badgeClass || 'badge-secondary'}`}>
              {activity.entityName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminActivity;
