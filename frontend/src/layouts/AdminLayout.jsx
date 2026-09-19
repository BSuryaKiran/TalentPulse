import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/navbar/AdminNavbar';
import AdminSidebar from '../components/sidebar/AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="admin-workspace-body">
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="admin-main-content">
          <div className="page-container admin-page-container">
            <Outlet />
          </div>

          <footer className="admin-footer">
            <p>
              &copy; {new Date().getFullYear()} <strong>TalentPulse</strong> – Enterprise Talent Acquisition & System Administration Console.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
