import { CheckCircle2, Clock, FileText, AlertCircle, Award } from 'lucide-react';

const getStatusBadgeConfig = (status) => {
  const normalized = (status || 'APPLIED').toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'UNDER_REVIEW':
      return {
        label: 'Under Review',
        className: 'status-badge status-review',
        icon: <Clock size={13} />,
      };
    case 'SHORTLISTED':
      return {
        label: 'Shortlisted',
        className: 'status-badge status-shortlisted',
        icon: <Award size={13} />,
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        className: 'status-badge status-rejected',
        icon: <AlertCircle size={13} />,
      };
    case 'SELECTED':
    case 'ACCEPTED':
      return {
        label: 'Selected',
        className: 'status-badge status-selected',
        icon: <CheckCircle2 size={13} />,
      };
    case 'APPLIED':
    default:
      return {
        label: 'Applied',
        className: 'status-badge status-applied',
        icon: <FileText size={13} />,
      };
  }
};

const ApplicationStatusBadge = ({ status }) => {
  const { label, className, icon } = getStatusBadgeConfig(status);

  return (
    <span className={className}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

export default ApplicationStatusBadge;
