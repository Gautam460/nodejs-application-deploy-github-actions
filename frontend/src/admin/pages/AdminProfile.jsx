import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import toast from 'react-hot-toast';
import { Camera, Save, Key, User } from 'lucide-react';

const AdminProfile = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Mock update
        const updatedUser = { ...user, name: formData.name };
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        toast.success("Profile details updated successfully!");
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return;
        }
        toast.success("Password changed successfully!");
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    };

    return (
        <AdminLayout role={user.role} title="My Profile">
            <div className="row g-4">
                {/* Profile Card */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-5">
                            <div className="position-relative d-inline-block mb-4">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold border border-primary border-opacity-10 mx-auto" style={{width: '120px', height: '120px', fontSize: '3rem'}}>
                                    {user.role?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <button className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 shadow-sm border p-2" title="Change Photo">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h4 className="fw-bold fs-4">{user.name || 'Admin User'}</h4>
                            <p className="text-muted mb-3">{user.email}</p>
                            <span className="badge bg-light text-dark border rounded-pill px-3 py-2 text-uppercase fw-bold letter-spacing-1">
                                {user.role || 'Admin'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Settings Forms */}
                <div className="col-lg-8">
                    {/* General Settings */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <User size={18} className="text-primary" />
                                General Information
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleUpdateProfile}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="form-control bg-light" 
                                            value={formData.email} 
                                            readOnly 
                                            disabled // Email typically updated separately for security
                                        />
                                        <small className="text-muted">Contact support to change email.</small>
                                    </div>
                                </div>
                                <div className="mt-4 text-end">
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 ms-auto">
                                        <Save size={18} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <Key size={18} className="text-warning" />
                                Security
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleUpdatePassword}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Current Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn btn-warning text-dark rounded-pill px-4 d-flex align-items-center gap-2 ms-auto">
                                        <Key size={18} /> Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;
