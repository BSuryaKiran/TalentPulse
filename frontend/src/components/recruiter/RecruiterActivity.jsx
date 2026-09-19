import { Clock, Activity, FileText, UserCheck, CalendarCheck, Eye } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'APPLICATION':
      return <FileText size={16} className="activity-icon icon-blue" />;
    case 'SHORTLISTED':
      return <UserCheck size={16} className="activity-icon icon-purple" />;
    case 'INTERVIEW':
      return <CalendarCheck size={16} className="activity-icon icon-emerald" />;
    case 'REVIEW':
      return <Eye size={16} className="activity-icon icon-amber" />;
    default:
      return <Activity size={16} className="activity-icon icon-gray" />;
  }
};

const getStatusBadgeClass = (variant) => {
  switch (variant) {
    case 'info':
      return 'badge-info';
    case 'purple':
      return 'badge-purple';
    case 'success':
      return 'badge-success';
    case 'warning':
      return 'badge-warning';
    default:
      return 'badge-secondary';
  }
};

const RecruiterActivity = ({ activities = [] }) => {
  return (
    <div className="recruiter-activity-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Recent Activity</h2>
          <p className="section-subtitle">Latest candidate applications, shortlists, and interviews</p>
        </div>
      </div>

      <div className="activity-card-container">
        {activities.length === 0 ? (
          <div className="empty-state">
            <Activity size={36} className="empty-icon" />
            <p>No recent recruitment activity recorded.</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {activities.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-left">
                  <div className="activity-icon-wrapper">
                    {getActivityIcon(item.type)}
                  </div>
                </div>

                <div className="activity-content">
                  <div className="activity-main-text">
                    <span className="candidate-name">{item.candidateName}</span>{' '}
                    <span className="action-text">{item.actionText}</span>{' '}
                    <strong className="job-title-highlight">{item.jobTitle}</strong>
                  </div>

                  <div className="activity-meta">
                    <span className="activity-time">
                      <Clock size={12} style={{ marginRight: 4 }} />
                      {item.time}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(item.statusVariant)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterActivity;
