import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import JobSeekerNavbar from '../components/navbar/JobSeekerNavbar';
import JobSeekerSidebar from '../components/sidebar/JobSeekerSidebar';

const JobSeekerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="jobseeker-layout">
      <JobSeekerNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="jobseeker-workspace-body">
        <JobSeekerSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="jobseeker-main-content">
          <div className="page-container">
            <Outlet />
          </div>
          
          <footer className="jobseeker-footer">
            <p>
              &copy; {new Date().getFullYear()} <strong>TalentPulse</strong> – Enterprise Talent Acquisition & Job Application Tracking Portal.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default JobSeekerLayout;
