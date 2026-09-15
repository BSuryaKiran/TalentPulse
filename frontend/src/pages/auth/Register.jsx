import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Eye, EyeOff, Lock, Mail, User, Briefcase, ArrowRight, UserCheck, Building2 } from 'lucide-react';

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
    try {
      // Register mock user
      const user = await register(
        formData.fullName,
        formData.email,
        formData.role
      );

      // Navigate to corresponding role dashboard
      const targetPath = user.role === 'RECRUITER' ? '/recruiter' : '/job-seeker';
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Briefcase size={28} />
          </div>
          <h2>Create Your TalentPulse Account</h2>
          <p className="auth-subtitle">Join the enterprise recruitment network</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">
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

