import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children, allowedRoles }) => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
    
    if (!adminUser || !adminUser.role) {
        return <Navigate to="/admin/login" replace />;
    }

    // Only allow admin roles (not customers)
    if (adminUser.role === 'customer') {
        return <Navigate to="/" replace />;
    }

    // Check specific role requirements if provided
    if (allowedRoles && !allowedRoles.includes(adminUser.role)) {
        // Redirect to dashboard if they have access, or home if not
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
