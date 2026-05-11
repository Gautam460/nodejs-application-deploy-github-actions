import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../assets/css/auth-styles.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Account created! Please login.');
                navigate('/login');
            } else {
                toast.error(data.message || 'Registration failed');
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
                            <i className="fa fa-user-plus"></i>
                        </div>
                        <h1 className="auth-heading">Create an account</h1>
                        <p className="auth-subheading">Join us — it's free and takes a minute</p>
                    </div>

                    {/* Body */}
                    <div className="auth-card-body">
                        <form onSubmit={handleSubmit}>

                            <div className="auth-form-group">
                                <label htmlFor="name" className="auth-form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="auth-form-input"
                                    id="name"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

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
                                    placeholder="Min 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                style={{ marginTop: '0.5rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
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
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;