import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AdminStatCard = ({ title, value, subtitle, icon, iconBg = 'icon-indigo', link, linkText }) => {
  return (
    <div className="stat-card admin-stat-card">
      <div className="admin-stat-top">
        <div className={`stat-icon-wrapper ${iconBg}`}>
          {icon}
        </div>
        {link && linkText && (
          <Link to={link} className="admin-stat-link" title={linkText}>
            <span>{linkText}</span>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>

      <div className="stat-info mt-2">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{title}</span>
        {subtitle && <span className="stat-subtext text-muted">{subtitle}</span>}
      </div>
    </div>
  );
};

export default AdminStatCard;
