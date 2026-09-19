import { Briefcase, Users, UserCheck, Calendar, TrendingUp } from 'lucide-react';

const iconMap = {
  Briefcase: Briefcase,
  Users: Users,
  UserCheck: UserCheck,
  Calendar: Calendar,
};

const RecruiterStatCard = ({ title, value, change, isPositive, icon, color, description }) => {
  const IconComponent = iconMap[icon] || Briefcase;

  return (
    <div className={`recruiter-stat-card stat-color-${color || 'blue'}`}>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <IconComponent size={22} />
        </div>
        {change && (
          <span className={`stat-trend-badge ${isPositive ? 'positive' : 'neutral'}`}>
            <TrendingUp size={12} style={{ marginRight: 4 }} />
            {change}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {description && <div className="stat-description">{description}</div>}
      </div>
    </div>
  );
};

export default RecruiterStatCard;
