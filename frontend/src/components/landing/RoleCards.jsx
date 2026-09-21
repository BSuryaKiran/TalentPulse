import { Link } from 'react-router-dom';
import { UserCheck, Building2, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const ROLES = [
  {
    id: 'seeker',
    title: 'Job Seeker',
    description:
      'Create your candidate profile, browse thousands of verified enterprise opportunities, apply in one click, and track every application status in real time.',
    icon: <UserCheck size={24} />,
    cardClass: 'role-card-seeker',
    targetPath: '/register',
    btnText: 'Get Started as Candidate',
    features: ['Build professional profile', 'Discover relevant jobs', 'One-click applications', 'Real-time status tracking'],
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    description:
      'Post and manage job requisitions, review applicants with rich candidate profiles, and move talent through your hiring pipeline efficiently.',
    icon: <Building2 size={24} />,
    cardClass: 'role-card-recruiter',
    targetPath: '/register',
    btnText: 'Hire Enterprise Talent',
    features: ['Create & publish job posts', 'Manage active requisitions', 'Review candidate profiles', 'Pipeline management'],
  },
  {
    id: 'admin',
    title: 'Admin',
    description:
      'Oversee the entire platform — manage users, monitor all job listings and applications, enforce role-based access policies, and ensure governance.',
    icon: <Shield size={24} />,
    cardClass: 'role-card-admin',
    targetPath: '/login',
    btnText: 'Access Admin Portal',
    features: ['User & role management', 'Monitor all job listings', 'Application analytics', 'Platform governance'],
  },
];

const RoleCards = () => {
  return (
    <section id="roles" className="nexstep-roles-section">
      <div className="nexstep-section-container text-center">
        <span className="nexstep-section-eyebrow">Tailored Workspaces</span>
        <h2 className="nexstep-section-title">
          Built for <span className="nexstep-purple-gradient">Everyone</span>
        </h2>
        <p className="nexstep-section-subtitle">
          Three purpose-built workspaces, each optimized for the stakeholder's unique workflow in the talent ecosystem.
        </p>

        <div className="nexstep-roles-grid">
          {ROLES.map((role) => (
            <div key={role.id} className={`nexstep-role-card ${role.cardClass}`}>
              <div className="role-icon-pill">{role.icon}</div>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-description">{role.description}</p>

              <ul className="role-features-list">
                {role.features.map((f, i) => (
                  <li key={i} className="role-feature-li">
                    <CheckCircle size={14} className="role-check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={role.targetPath}
                className="role-demo-btn"
              >
                <span>{role.btnText}</span>
                <ArrowRight size={13} style={{ marginLeft: 'auto' }} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
