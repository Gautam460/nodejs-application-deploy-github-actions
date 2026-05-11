import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";
import "../assets/css/auth-styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Login successful!');
        localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card-saas">

          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-logo-mark">
              <i className="fa fa-user"></i>
            </div>
            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-subheading">Sign in to your account to continue</p>
          </div>

          {/* Body */}
          <div className="auth-card-body">
            <form onSubmit={handleSubmit}>

              <div className="auth-form-group">
                <label htmlFor="email" className="auth-form-label">Email address</label>
                <input
                  type="email"
                  className="auth-form-input"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password" className="auth-form-label">Password</label>
                <input
                  type="password"
                  className="auth-form-input"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Remember + Forgot */}
              <div className="auth-form-footer-row">
                <label className="auth-remember-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="auth-forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Social */}
            <div className="auth-divider">
              <div className="auth-divider-line"></div>
              <span className="auth-divider-text">or continue with</span>
              <div className="auth-divider-line"></div>
            </div>

            <div className="auth-social-row">
              <button className="auth-social-btn" type="button" title="Google">
                <i className="fab fa-google" style={{ color: '#EA4335' }}></i>
              </button>
              <button className="auth-social-btn" type="button" title="Facebook">
                <i className="fab fa-facebook-f" style={{ color: '#1877F2' }}></i>
              </button>
            </div>

            <div className="auth-footer-link-row">
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
