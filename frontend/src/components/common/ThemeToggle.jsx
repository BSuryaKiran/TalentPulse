import { useTheme } from '../../context/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '', size = 18 }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? 'dark' : 'light'} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="theme-toggle-icon-wrap">
        {isDark ? (
          <Sun size={size} className="theme-icon sun-icon" />
        ) : (
          <Moon size={size} className="theme-icon moon-icon" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
