import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Swal from 'sweetalert2';
import { Plus, RefreshCcw, Pencil, Trash2, UserPlus, Shield, Mail, Calendar, UserCheck } from 'lucide-react';
import { userApi } from "../../api/user.api";
import { roleApi } from "../../api/role.api";
import toast from "react-hot-toast";

const UsersPage = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: 'customer' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'customer' });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers();
      if (res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await roleApi.getAllRoles();
      if (res.data) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      borderRadius: '16px'
    });

    if (!result.isConfirmed) return;
    try {
      await userApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ role: user.role });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
       const res = await userApi.updateUser(editingUser.id, formData);
       if (res.status === 200) {
         fetchUsers();
         setShowModal(false);
         setEditingUser(null);
         toast.success("User role updated successfully");
       }
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error("Failed to update role");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
        const res = await userApi.createUser(newUser);
        if (res.status === 200 || res.status === 201) {
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'customer' });
            fetchUsers();
            toast.success("User created successfully");
        }
    } catch (error) {
        console.error("Error creating user", error);
        toast.error("Error creating user");
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin': return 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-10';
      case 'admin': return 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-10';
      case 'vendor': return 'bg-info bg-opacity-10 text-info border-info border-opacity-10';
      case 'reseller': return 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-10';
      default: return 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-10';
    }
  };

  return (
    <AdminLayout role={user.role} title="User Management">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold">User Management</h5>
            <p className="text-muted small mb-0">Total system users: {users.length}</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary rounded-pill px-4 btn-sm d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowAddModal(true)}>
                <UserPlus size={16} /> Add User
            </button>
            <button className="btn btn-light border rounded-pill px-4 btn-sm d-flex align-items-center gap-2" onClick={fetchUsers}>
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>
        <div className="card-body p-0">
           {loading ? (
             <div className="text-center py-5">
               <RefreshCcw size={40} className="animate-spin text-primary opacity-20" />
               <p className="text-muted mt-2">Loading users...</p>
             </div>
           ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="px-4 py-3 border-0 text-muted small text-uppercase fw-bold">Name & Email</th>
                    <th className="py-3 border-0 text-muted small text-uppercase fw-bold">Role</th>
                    <th className="py-3 border-0 text-muted small text-uppercase fw-bold">Joined Date</th>
                    <th className="py-3 border-0 text-end px-4 text-muted small text-uppercase fw-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => user.role === 'superadmin' || u.role !== 'superadmin')
                    .map(u => {
                      // Safety check: Adms cannot see Superadmins
                      if (user.role === 'admin' && u.role === 'superadmin') return null;
                      
                      return (
                        <tr key={u.id}>
                          <td className="px-4">
                            <div className="d-flex align-items-center gap-3">
                              <div className="p-2 rounded-circle bg-light text-primary">
                                <Shield size={18} />
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{u.name || 'No Name'}</div>
                                <div className="text-muted small d-flex align-items-center gap-1">
                                  <Mail size={12} /> {u.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge border rounded-pill px-3 py-2 fw-medium ${getRoleBadge(u.role)}`}>
                              {u.role ? u.role.toUpperCase() : 'CUSTOMER'}
                            </span>
                          </td>
                          <td className="text-muted small">
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={13} />
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="text-end px-4">
                            <div className="d-flex justify-content-end gap-2">
                              {/* Admins cannot edit other Admins or Superadmins easily, or restrict to self? 
                                  User requested: Superadmin sees all, Admin sees all except Superadmin.
                                  So Admin can edit other users including other Admins, but NOT Superadmins.
                              */}
                              <button className="btn btn-light btn-sm rounded-pill px-3 d-flex align-items-center gap-1 hover-shadow-sm transition-all" onClick={() => handleEdit(u)}>
                                <Pencil size={12} className="text-primary" /> Edit Role
                              </button>
                              <button className="btn btn-light btn-sm rounded-circle text-danger border-0" onClick={() => handleDelete(u.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {users.filter(u => user.role === 'superadmin' || u.role !== 'superadmin').length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="opacity-20 text-muted">
                          <Shield size={48} className="mb-2" />
                          <p className="mb-0">No users found in the system</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
           )}
        </div>
      </div>

      {/* Edit Role Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-primary text-white p-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-circle">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Change Access Role</h5>
                    <p className="small mb-0 opacity-75">Update permissions for {editingUser?.name}</p>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                    <label className="form-label fw-bold small text-muted text-uppercase mb-2">Select New Role</label>
                    <div className="row g-2">
                      {['superadmin', 'admin', 'vendor', 'reseller', 'customer']
                        .filter(r => user.role === 'superadmin' || r !== 'superadmin')
                        .map(r => (
                          <div className="col-6" key={r}>
                            <div 
                              className={`p-3 border rounded-3 cursor-pointer transition-all d-flex align-items-center gap-2 ${formData.role === r ? 'bg-primary border-primary shadow-sm text-white' : 'bg-white text-dark hover-bg-light'}`}
                              onClick={() => setFormData({...formData, role: r})}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className={`p-1.5 rounded-circle ${formData.role === r ? 'bg-white bg-opacity-20 text-white' : 'bg-light text-muted'}`}>
                                <Shield size={14} />
                              </div>
                              <span className="small fw-bold text-capitalize">{r}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
                
                {/* Dynamic roles from database if any */}
                {roles.length > 0 && !['superadmin', 'admin', 'vendor', 'reseller', 'customer'].includes(roles[0]?.name) && (
                  <div className="mt-3">
                    <label className="form-label fw-bold small text-muted text-uppercase mb-2">Other Custom Roles</label>
                    <select 
                      className="form-select rounded-3 p-3" 
                      value={formData.role} 
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="">Choose a custom role...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="modal-title fw-bold">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleCreateUser}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Profile Name</label>
                        <input type="text" className="form-control rounded-3 p-2.5" required placeholder="Enter full name"
                            value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                        <input type="email" className="form-control rounded-3 p-2.5" required placeholder="user@example.com"
                            value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Password</label>
                        <input type="password" className="form-control rounded-3 p-2.5" required placeholder="Min. 8 characters"
                            value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Assign Role</label>
                        <select className="form-select rounded-3 p-2.5 text-capitalize" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="customer">Customer</option>
                            <option value="reseller">Reseller</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                            {user.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
                            {roles.filter(r => !['superadmin', 'admin', 'vendor', 'reseller', 'customer'].includes(r.name)).map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-light px-4 rounded-pill" onClick={() => setShowAddModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary px-5 rounded-pill shadow-sm">Create Account</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersPage;
