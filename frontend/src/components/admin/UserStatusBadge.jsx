import { CheckCircle2, XCircle } from 'lucide-react';

const UserStatusBadge = ({ status }) => {
  const normalized = (status || 'ACTIVE').toUpperCase();
  const isActive = normalized === 'ACTIVE';

  return (
    <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
      {isActive ? <CheckCircle2 size={12} style={{ marginRight: 4 }} /> : <XCircle size={12} style={{ marginRight: 4 }} />}
      {normalized}
    </span>
  );
};

export default UserStatusBadge;
