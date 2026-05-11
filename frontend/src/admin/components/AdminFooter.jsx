import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <div>
        &copy; {new Date().getFullYear()} <span style={{ color: '#fff', fontWeight: 700 }}>PRINCE<span style={{ color: '#3b82f6' }}>.AI</span></span>. All rights reserved.
      </div>
      <div className="d-none d-sm-flex gap-4">
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>System Status</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
      </div>
    </footer>
  );
};

export default AdminFooter;
