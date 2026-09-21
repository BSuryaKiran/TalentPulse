import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import ThemeToggle from '../../components/common/ThemeToggle';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Briefcase,
  ArrowRight,
  UserCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'JOB_SEEKER', // Default public role option
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!['JOB_SEEKER', 'RECRUITER'].includes(formData.role)) {
      newErrors.role = 'Please select a valid role (Job Seeker or Recruiter)';
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
    setSuccessMessage('');

    try {
      // Register via Auth Service API
      await register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.role
      );

      setSuccessMessage('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
      const backendMsg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        setErrors(fieldErrors);
      } else {
        setErrors({ general: backendMsg });
      }
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
          <h2>Create Your TalentPulse Account</h2>
          <p className="auth-subtitle">Join the enterprise recruitment network</p>
        </div>

        {successMessage && (
          <div className="alert alert-success-banner mb-3">
            <div className="alert-content">
              <CheckCircle2 size={18} className="alert-icon" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="alert alert-error mb-3">
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Role Selection Options (Job Seeker vs Recruiter only) */}
          <div className="form-group">
            <label>Select Account Type</label>
            <div className="role-cards-grid">
              <label
                className={`role-option-card ${
                  formData.role === 'JOB_SEEKER' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="JOB_SEEKER"
                  checked={formData.role === 'JOB_SEEKER'}
                  onChange={handleChange}
                  className="visually-hidden"
                />
                <UserCheck size={22} className="role-option-icon" />
                <div className="role-option-info">
                  <span className="role-option-title">Job Seeker</span>
                  <span className="role-option-desc">Explore & apply for opportunities</span>
                </div>
              </label>

              <label
                className={`role-option-card ${
                  formData.role === 'RECRUITER' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="RECRUITER"
                  checked={formData.role === 'RECRUITER'}
                  onChange={handleChange}
                  className="visually-hidden"
                />
                <Building2 size={22} className="role-option-icon" />
                <div className="role-option-info">
                  <span className="role-option-title">Recruiter</span>
                  <span className="role-option-desc">Post jobs & hire top candidates</span>
                </div>
              </label>
            </div>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={errors.fullName ? 'input-error' : ''}
              />
            </div>
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                aria-label={
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg"
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
            {!submitting && <ArrowRight size={18} style={{ marginLeft: 8 }} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
