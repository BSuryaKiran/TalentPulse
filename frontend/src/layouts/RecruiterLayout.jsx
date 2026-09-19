import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RecruiterNavbar from '../components/navbar/RecruiterNavbar';
import RecruiterSidebar from '../components/sidebar/RecruiterSidebar';

const RecruiterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="recruiter-layout">
      <RecruiterNavbar onToggleSidebar={toggleSidebar} />

      <div className="recruiter-workspace-body">
        <RecruiterSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="recruiter-main-content">
          <div className="page-container">
            <Outlet />
          </div>

          <footer className="recruiter-footer">
            <p>
              &copy; {new Date().getFullYear()} <strong>TalentPulse</strong> – Enterprise Talent Acquisition & Job Application Tracking Portal.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
