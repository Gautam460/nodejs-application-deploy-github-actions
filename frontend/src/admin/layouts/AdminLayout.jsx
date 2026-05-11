import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminFooter from '../components/AdminFooter';
import { ThemeProvider } from '../context/ThemeContext';
import '../../assets/css/admin-layout.css';
import { roleApi } from '../../api/role.api';

const AdminLayoutContent = ({ children, role, title }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [permissions, setPermissions] = useState([]);
    const [adminUser, setAdminUser] = useState({});

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('adminUser')) || {};
            setAdminUser(user);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile && !isSidebarOpen) setSidebarOpen(true);
            if (mobile && isSidebarOpen) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                if (role === 'superadmin') return;
                const response = await roleApi.getAllRoles();
                const userRole = response.data.find(r => r.name === role);
                if (userRole?.permissions) {
                    setPermissions(userRole.permissions.map(p => p.key));
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (role) fetchUserPermissions();
    }, [role]);

    const hasPermission = (key) => role === 'superadmin' || permissions.includes(key);

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="admin-root">
            {isMobile && isSidebarOpen && (
                <div 
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 95, backdropFilter: 'blur(4px)' }} 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar 
                isMobile={isMobile}
                isMinimized={!isSidebarOpen && !isMobile}
                role={role}
                hasPermission={hasPermission}
                onLogout={handleLogout}
            />

            <div className={`admin-main ${(!isSidebarOpen && !isMobile) ? 'full-width' : ''}`}>
                <Header 
                    title={title} 
                    user={adminUser} 
                    role={role}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    onLogout={handleLogout}
                />

                <main className="content-wrapper custom-scrollbar">
                    {children}
                </main>

                <AdminFooter />
            </div>
        </div>
    );
};

const AdminLayout = (props) => (
    <ThemeProvider>
        <AdminLayoutContent {...props} />
    </ThemeProvider>
);

export default AdminLayout;
