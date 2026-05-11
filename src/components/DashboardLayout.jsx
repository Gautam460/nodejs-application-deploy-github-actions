import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import "../assets/css/styles.css";

const DashboardLayout = ({ children, role, title }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 991);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

    React.useEffect(() => {
        const handleResize = () => {
             const mobile = window.innerWidth <= 991;
             setIsMobile(mobile);
             if(!mobile && !isSidebarOpen) setSidebarOpen(true);
             if(mobile && isSidebarOpen) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        navigate('/');
        window.location.reload();
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <div className="d-flex h-100vh bg-light overflow-hidden" style={{ height: '100vh', backgroundColor: '#F3F6F9' }}>
            <Toaster position="top-right" />
            
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
                    style={{zIndex: 1039}}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Metronic-style Sidebar */}
            <aside 
                className={`bg-dark text-white d-flex flex-column transition-all ${isSidebarOpen ? 'w-265px' : 'w-70px'}`}
                style={{ 
                    width: isSidebarOpen ? '265px' : (isMobile ? '0px' : '70px'), 
                    transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
                    position: isMobile ? 'fixed' : 'relative',
                    height: '100%',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    zIndex: 1040,
                    backgroundColor: '#1e1e2d',
                    overflow: 'hidden'
                }}
            >
                {/* Brand */}
                <div className="h-70px d-flex align-items-center px-4" style={{ backgroundColor: '#1b1b28', minHeight: '70px' }}>
                     {isSidebarOpen ? (
                         <span className="fw-bolder fs-3 text-white tracking-tight text-nowrap">METRONIC<span className="text-primary">LITE</span></span>
                     ) : (
                         <span className="fw-bold fs-3 text-primary mx-auto">M</span>
                     )}
                </div>

                {/* User Info (Mini) */}
                <div className="px-4 py-4 border-bottom border-secondary mb-2" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                    {isSidebarOpen && (
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary text-white rounded px-2 py-1 fs-3 fw-bold">
                                {role.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <div className="fw-bold text-white text-truncate">{role} User</div>
                                <div className="small text-muted text-truncate w-100">Welcome back</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <ul className="nav nav-pills flex-column gap-1 p-3 flex-grow-1 overflow-auto custom-scrollbar flex-nowrap">
                     <div className="small fw-bold text-uppercase text-muted opacity-50 mb-2 px-3 text-nowrap" style={{ fontSize: '10px', display: isSidebarOpen ? 'block' : 'none'}}>Main</div>
                     
                     <NavItem 
                        to={`/dashboard/${role.toLowerCase().replace(" ", "")}`} 
                        icon="fa-dashboard" 
                        label="Dashboard" 
                        active={location.pathname === `/dashboard/${role.toLowerCase().replace(" ", "")}`}
                        minimized={!isSidebarOpen && !isMobile}
                    />

                    {role === 'Super Admin' && (
                        <>
                            <div className="small fw-bold text-uppercase text-muted opacity-50 mt-4 mb-2 px-3 text-nowrap" style={{ fontSize: '10px', display: isSidebarOpen ? 'block' : 'none'}}>Administration</div>
                            <NavItem to="#" icon="fa-users" label="User Management" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-shield" label="Roles & Permissions" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-cogs" label="System Settings" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-file-text" label="Audit Logs" minimized={!isSidebarOpen && !isMobile} />
                        </>
                    )}

                    {role === 'Admin' && (
                        <>
                            <div className="small fw-bold text-uppercase text-muted opacity-50 mt-4 mb-2 px-3 text-nowrap" style={{ fontSize: '10px', display: isSidebarOpen ? 'block' : 'none'}}>Store</div>
                            <NavItem to="#" icon="fa-shopping-cart" label="Orders" minimized={!isSidebarOpen && !isMobile} badge="12" />
                            <NavItem to="#" icon="fa-briefcase" label="Products" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-users" label="Customers" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-tag" label="Coupons" minimized={!isSidebarOpen && !isMobile} />
                        </>
                    )}

                    {role === 'Vendor' && (
                        <>
                            <div className="small fw-bold text-uppercase text-muted opacity-50 mt-4 mb-2 px-3 text-nowrap" style={{ fontSize: '10px', display: isSidebarOpen ? 'block' : 'none'}}>My Shop</div>
                            <NavItem to="#" icon="fa-cube" label="My Catalog" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-money" label="Earnings" minimized={!isSidebarOpen && !isMobile} />
                            <NavItem to="#" icon="fa-comments" label="Reviews" minimized={!isSidebarOpen && !isMobile} />
                        </>
                    )}
                </ul>

                {/* Footer Actions */}
                <div className="p-3 mt-auto border-top border-secondary">
                    <button 
                        onClick={handleLogout}
                        className={`btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 ${!isSidebarOpen && !isMobile ? 'p-2' : ''}`}
                    >
                        <i className="fa fa-power-off"></i>
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main className="d-flex flex-column flex-grow-1 overflow-hidden h-100">
                {/* Header - Sticky */}
                <header className="h-70px bg-white shadow-sm d-flex align-items-center justify-content-between px-4 sticky-top flex-shrink-0" style={{ zIndex: 1000, minHeight: '70px'}}>
                     <div className="d-flex align-items-center gap-3">
                         <button className="btn btn-icon btn-active-light-primary p-0" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                             <i className="fa fa-bars fs-4 text-muted"></i>
                         </button>
                         <h3 className="m-0 fs-5 fw-bold text-dark">{title}</h3>
                     </div>

                     <div className="d-flex align-items-center gap-4">
                         {/* Search */}
                         <div className="d-none d-md-block position-relative">
                             <input type="text" className="form-control form-control-solid bg-light border-0 ps-5" placeholder="Search..." style={{width: '250px'}} />
                             <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                         </div>

                         {/* Icons */}
                         <button className="btn btn-icon btn-active-light-primary position-relative">
                             <i className="fa fa-bell fs-5 text-muted"></i>
                             <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                         </button>
                         
                         <div className="d-flex align-items-center gap-2">
                             <div className="text-end d-none d-md-block">
                                 <div className="fw-bolder text-dark fs-7">Clavis</div>
                                 <div className="text-muted fs-8">{role}</div>
                             </div>
                             <div className="bg-light rounded px-2 py-1"><i className="fa fa-user text-primary"></i></div>
                         </div>
                     </div>
                </header>

                {/* Content Body */}
                <div className="flex-grow-1 overflow-auto p-4 p-lg-5" style={{ backgroundColor: '#F3F6F9', scrollBehavior: 'smooth' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, active, minimized, badge }) => (
    <Link 
        to={to} 
        className={`nav-link d-flex align-items-center px-3 py-3 rounded transition-all mb-1 ${active ? 'bg-primary text-white' : 'text-white-50 hover-text-white hover-bg-light-opacity'}`}
        title={label}
        style={{ whiteSpace: 'nowrap' }}
    >
        <i className={`fa ${icon} ${minimized ? 'mx-auto fs-4' : 'me-3 w-20px text-center'}`}></i>
        {!minimized && (
            <span className="fw-semibold flex-grow-1">{label}</span>
        )}
        {!minimized && badge && <span className="badge bg-danger rounded-pill ms-2">{badge}</span>}
    </Link>
);

export default DashboardLayout;

