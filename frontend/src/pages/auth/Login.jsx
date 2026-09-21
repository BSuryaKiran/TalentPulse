import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import ThemeToggle from '../../components/common/ThemeToggle';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Briefcase,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'JOB_SEEKER',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      // Call Auth Service API via AuthContext
      const user = await login(formData.email, formData.password);

      // Determine destination based on user role or redirect location state
      const fromPath = location.state?.from?.pathname;
      let targetPath = fromPath;
      if (!targetPath || targetPath === '/login' || targetPath === '/') {
        switch (user.role?.toUpperCase()) {
          case 'RECRUITER':
            targetPath = '/recruiter';
            break;
          case 'ADMIN':
            targetPath = '/admin';
            break;
          default:
            targetPath = '/job-seeker/dashboard';
            break;
        }
      }
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const backendMsg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setErrors({ general: backendMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-top-bar">
          <ThemeToggle />
        </div>
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Briefcase size={28} />
          </div>
          <h2>Welcome to TalentPulse</h2>
          <p className="auth-subtitle">Sign in to your enterprise account</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            {!submitting && <ArrowRight size={18} style={{ marginLeft: 8 }} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>

        <div className="auth-security-note">
          <ShieldCheck size={14} style={{ marginRight: 6 }} />
          <span>TalentPulse Secure Portal — Phase 5 Integration</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
