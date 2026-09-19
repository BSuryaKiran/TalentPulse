import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, FileSpreadsheet, Building2, ArrowRight } from 'lucide-react';

const iconMap = {
  PlusCircle: PlusCircle,
  Briefcase: Briefcase,
  FileSpreadsheet: FileSpreadsheet,
  Building2: Building2,
};

const RecruiterQuickActions = ({ actions = [] }) => {
  return (
    <div className="recruiter-quick-actions-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-subtitle">Key workflows and frequent recruiter tasks</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const IconComponent = iconMap[action.icon] || Briefcase;

          return (
            <div key={action.id} className="quick-action-card">
              <div className="qa-card-top">
                <div className={`qa-icon-box ${action.variant || 'primary'}`}>
                  <IconComponent size={20} />
                </div>
                {action.badgeText && (
                  <span className="qa-badge">{action.badgeText}</span>
                )}
              </div>

              <div className="qa-card-content">
                <h3 className="qa-title">{action.title}</h3>
                <p className="qa-description">{action.description}</p>
              </div>

              <div className="qa-card-footer">
                <Link
                  to={action.path}
                  className={`btn btn-sm ${
                    action.variant === 'primary' ? 'btn-primary' : 'btn-outline'
                  } qa-btn`}
                >
                  <span>{action.buttonText}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecruiterQuickActions;
