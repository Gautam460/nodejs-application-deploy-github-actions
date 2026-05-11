import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import "../../assets/css/auth-styles.css";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authApi.login({ email, password });
            if (response.status === 200) {
                const { user, token } = response.data;
                if (user.role === 'customer') {
                    toast.error("Access denied. Customer accounts cannot access admin panel.");
                    return;
                }
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));
                toast.success(`Welcome ${user.name}!`);
                navigate('/admin/dashboard');
            } else {
                toast.error("Invalid credentials");
            }
        } catch {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const roleMap = {
        superadmin: ['super@admin.com', '123'],
        admin: ['admin@admin.com', '123'],
        account_manager: ['account@account.com', '123'],
        vendor: ['vendor@vendor.com', '123'],
        reseller: ['reseller@reseller.com', '123'],
        wholesale: ['wholesale@wholesale.com', '123'],
        delivery_partner: ['delivery@delivery.com', '123'],
    };

    return (
        <div className="auth-page">
            <div className="auth-card-saas">

                {/* Card Header */}
                <div className="auth-card-header">
                    <div className="auth-logo-mark">
                        <i className="fa fa-shield"></i>
                    </div>
                    <h1 className="auth-heading">Admin Portal</h1>
                    <p className="auth-subheading">Secure access for your team</p>
                </div>

                {/* Card Body */}
                <div className="auth-card-body">
                    <form onSubmit={handleLogin}>

                        {/* Role Selector */}
                        <div className="auth-form-group">
                            <label className="auth-form-label">Quick Login (Demo)</label>
                            <div className="auth-select-wrapper">
                                <select
                                    className="auth-form-select"
                                    onChange={(e) => {
                                        const creds = roleMap[e.target.value];
                                        if (creds) { setEmail(creds[0]); setPassword(creds[1]); }
                                        else { setEmail(""); setPassword(""); }
                                    }}
                                >
                                    <option value="">Select a role...</option>
                                    <option value="superadmin">Super Admin</option>
                                    <option value="admin">Admin</option>
                                    <option value="account_manager">Account Manager</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="reseller">Reseller</option>
                                    <option value="wholesale">Wholesale Customer</option>
                                    <option value="delivery_partner">Delivery Partner</option>
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="auth-form-group">
                            <label className="auth-form-label">Email Address</label>
                            <input
                                type="email"
                                className="auth-form-input"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="auth-form-group">
                            <label className="auth-form-label">Password</label>
                            <input
                                type="password"
                                className="auth-form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="auth-submit-btn"
                            style={{ marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer-link-row" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        <i className="fa fa-lock" style={{ marginRight: '0.3rem' }}></i>
                        Restricted to admin accounts only
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
