import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  FileText, 
  ShoppingCart, 
  Package, 
  FolderTree, 
  UserCircle, 
  LogOut,
  Sparkles,
  Edit3,
  Box,
  Wallet,
  MessageSquare,
  Network,
  TrendingUp,
  CreditCard
} from 'lucide-react';

const Sidebar = ({ isMinimized, role, hasPermission, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { 
      section: 'Overview',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: true }
      ]
    },
    {
      section: 'Administration',
      items: [
        { path: '/admin/users', label: 'User Management', icon: Users, permission: hasPermission('manage_users') },
        { path: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck, permission: hasPermission('manage_roles') },
        { path: '/admin/settings', label: 'System Settings', icon: Settings, permission: hasPermission('manage_settings') },
        { path: '/admin/logs', label: 'Audit Logs', icon: FileText, permission: hasPermission('view_reports') }
      ]
    },
    {
      section: 'E-Commerce',
      items: [
        { path: '/admin/orders', label: 'Orders', icon: ShoppingCart, permission: hasPermission('manage_orders') },
        { path: '/admin/custom-orders', label: 'Custom Orders', icon: Edit3, permission: hasPermission('manage_orders') },
        { path: '/admin/products', label: 'Products', icon: Package, permission: hasPermission('manage_products') },
        { path: '/admin/categories', label: 'Category Master', icon: FolderTree, permission: role === 'superadmin' },
        { path: '/admin/customers', label: 'Customers', icon: UserCircle, permission: hasPermission('manage_users') },
        { path: '/admin/content', label: 'Content CMS', icon: Box, permission: hasPermission('manage_content') }
      ]
    }
  ];

  if (role === 'vendor') {
    menuItems.push({
      section: 'My Shop',
      items: [
        { path: '/admin/my-products', label: 'My Catalog', icon: Package, permission: true },
        { path: '/admin/earnings', label: 'Earnings', icon: Wallet, permission: true },
        { path: '/admin/reviews', label: 'Reviews', icon: MessageSquare, permission: true }
      ]
    });
  }

  if (hasPermission('view_network')) {
    menuItems.push({
      section: 'Reseller Zone',
      items: [
        { path: '/admin/network', label: 'My Network', icon: Network, permission: true },
        { path: '/admin/sales', label: 'Sales Logs', icon: TrendingUp, permission: true },
        { path: '/admin/payouts', label: 'Payouts', icon: CreditCard, permission: true }
      ]
    });
  }

  return (
    <aside className={`admin-sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-brand">
        <Sparkles size={24} color="var(--accent-base)" style={{ marginRight: isMinimized ? '0' : '10px' }} />
        {!isMinimized && <span>PRINCE <span>ADMIN</span></span>}
      </div>

      <div className="sidebar-nav custom-scrollbar flex-grow-1">
        {menuItems.map((section, idx) => {
          const visibleItems = section.items.filter(item => item.permission);
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="mb-4">
              {!isMinimized && (
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 28px', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  {section.section}
                </div>
              )}
              {visibleItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link-item ${location.pathname === item.path ? 'active' : ''}`}
                  title={isMinimized ? item.label : ''}
                >
                  <item.icon size={18} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                  {!isMinimized && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
        <button 
          className="nav-link-item w-100 border-0 bg-transparent text-danger m-0"
          onClick={onLogout}
        >
          <LogOut size={18} />
          {!isMinimized && <span style={{ fontWeight: 600 }}>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
