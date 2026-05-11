import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const AdminPlaceholderPage = ({ title, description }) => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

    return (
        <AdminLayout role={user.role} title={title}>
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center py-5">
                <div className="bg-light rounded-circle p-5 mb-4 d-flex align-items-center justify-content-center" style={{width: '200px', height: '200px'}}>
                    <i className="fa fa-cogs text-muted" style={{fontSize: '80px', opacity: 0.5}}></i>
                </div>
                <h2 className="fw-bold mb-3">{title}</h2>
                <p className="text-muted lead mb-4" style={{maxWidth: '500px'}}>{description || "This module is currently under development. Please check back later."}</p>
                <div className="alert alert-info border-0 bg-info bg-opacity-10 text-info">
                   <i className="fa fa-info-circle me-2"></i>
                   Feature coming in v2.0
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPlaceholderPage;
