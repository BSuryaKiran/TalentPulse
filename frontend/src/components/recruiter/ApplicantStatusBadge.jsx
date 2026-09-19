const getBadgeConfig = (status) => {
  switch (status) {
    case 'APPLIED':
      return { label: 'APPLIED', className: 'badge-info' };
    case 'UNDER_REVIEW':
      return { label: 'UNDER REVIEW', className: 'badge-warning' };
    case 'SHORTLISTED':
      return { label: 'SHORTLISTED', className: 'badge-purple' };
    case 'REJECTED':
      return { label: 'REJECTED', className: 'badge-danger' };
    case 'SELECTED':
      return { label: 'SELECTED', className: 'badge-success' };
    default:
      return { label: status || 'UNKNOWN', className: 'badge-secondary' };
  }
};

const ApplicantStatusBadge = ({ status }) => {
  const { label, className } = getBadgeConfig(status);

  return <span className={`badge ${className}`}>{label}</span>;
};

export default ApplicantStatusBadge;
