import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Bell, Search, Menu, User, LogOut, Settings, ChevronDown, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Reorder, motion } from 'framer-motion';

const Header = ({ title, user, role, onToggleSidebar, onLogout }) => {
  const { mode, toggleMode, accent, setAccent, accentList, reorderAccents, updateAccentColor } = useTheme();
  const colorInputRef = useRef(null);
  const activeColorToEdit = useRef(null);

  const handleDotClick = (item) => {
    if (accent === item.id) {
      // If clicking already active dot, open color picker
      activeColorToEdit.current = item.id;
      colorInputRef.current?.click();
    } else {
      setAccent(item.id);
    }
  };

  const handleColorChange = (e) => {
    if (activeColorToEdit.current) {
      updateAccentColor(activeColorToEdit.current, e.target.value);
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left d-flex align-items-center gap-3">
        <button className="icon-btn border-0 shadow-none bg-transparent d-lg-none" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <h1 className="mb-0 d-none d-md-block" style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>{title}</h1>
      </div>

      <div className="header-right d-flex align-items-center gap-2">
        {/* Accent Switcher - Drag & Drop enabled */}
        <div 
          className="d-flex align-items-center gap-1 px-1.5 py-1.5 rounded-pill me-2 d-none d-sm-flex border shadow-sm" 
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-color)', minWidth: '130px' }}
        >
          <Reorder.Group 
            axis="x" 
            values={accentList} 
            onReorder={reorderAccents} 
            className="d-flex align-items-center gap-2 list-unstyled m-0 p-0"
            style={{ touchAction: 'none' }}
          >
            {accentList.map((item) => (
              <Reorder.Item 
                key={item.id} 
                value={item}
                style={{ cursor: 'grab' }}
              >
                <motion.div
                  className={`theme-dot ${accent === item.id ? 'active' : ''}`}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                  onClick={() => handleDotClick(item)}
                  title={accent === item.id ? `Change ${item.name} color` : `${item.name} accent`}
                  style={{ 
                    background: item.color,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    border: accent === item.id ? '2.5px solid white' : 'none',
                    boxShadow: accent === item.id ? `0 0 0 1.5px ${item.color}, 0 2px 4px rgba(0,0,0,0.1)` : 'none',
                    position: 'relative'
                  }}
                >
                    {accent === item.id && (
                        <motion.div 
                            layoutId="active-glow"
                            className="position-absolute"
                            style={{ 
                                inset: '-4px', 
                                border: `1px solid ${item.color}`, 
                                borderRadius: '50%',
                                opacity: 0.3
                            }}
                        />
                    )}
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          
          <input 
            type="color" 
            ref={colorInputRef} 
            className="visually-hidden" 
            onChange={handleColorChange} 
          />
        </div>

        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleMode} title="Toggle Theme">
          {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="icon-btn position-relative d-none d-md-flex">
          <Bell size={18} />
          <span className="position-absolute p-1 bg-danger border border-white rounded-circle" style={{ top: '10px', right: '10px' }}></span>
        </button>

        <div className="dropdown ms-2">
          <div className="profile-trigger dropdown-toggle d-flex align-items-center gap-2 border rounded-pill p-1 pe-3" 
               data-bs-toggle="dropdown" 
               aria-expanded="false"
               style={{ cursor: 'pointer', background: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}>
            <div className="avatar" style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--accent-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="d-none d-lg-block text-start">
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{role || 'Administrator'}</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" className="ms-1" />
          </div>
          
          <ul className="dropdown-menu dropdown-menu-end p-2 border-0 shadow-lg mt-2" style={{ 
            background: 'var(--bg-surface)', 
            borderRadius: '16px', 
            minWidth: '220px',
            border: '1px solid var(--border-color)'
          }}>
            <li className="px-3 py-2 border-bottom mb-2 d-lg-none">
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
            </li>
            <li>
              <Link to="/admin/profile" className="dropdown-item d-flex align-items-center gap-3 rounded-3 py-2 px-3" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                <User size={18} className="text-muted" /> My Profile
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="dropdown-item d-flex align-items-center gap-3 rounded-3 py-2 px-3" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                <Settings size={18} className="text-muted" /> System Settings
              </Link>
            </li>
            <li className="my-2"><hr className="dropdown-divider opacity-10" /></li>
            <li>
              <button 
                className="dropdown-item d-flex align-items-center gap-3 rounded-3 py-2 px-3 text-danger w-100 border-0 bg-transparent text-start" 
                style={{ fontSize: '14px', fontWeight: 600 }}
                onClick={onLogout}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
