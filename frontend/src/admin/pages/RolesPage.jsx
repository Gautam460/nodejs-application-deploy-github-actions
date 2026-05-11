import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { roleApi } from "../../api/role.api";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, CheckCircle, Shield } from 'lucide-react';

const RolesPage = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermModal, setShowPermModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [selectedPerms, setSelectedPerms] = useState([]);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await roleApi.getAllRoles();
            setRoles(res.data || []);
        } catch (error) {
            console.error("Failed to fetch roles", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await roleApi.getAllPermissions();
            setPermissions(res.data || []);
        } catch (error) {
            console.error("Failed to fetch permissions", error);
        }
    };

    const handleEditRole = (role) => {
        setEditingRole(role);
        setFormData({ name: role.name, description: role.description });
        setShowRoleModal(true);
    };

    const handleCreateRole = () => {
        setEditingRole(null);
        setFormData({ name: "", description: "" });
        setShowRoleModal(true);
    };

    const handleDeleteRole = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Role?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!result.isConfirmed) return;
        try {
            await roleApi.deleteRole(id);
            setRoles(prev => prev.filter(r => r.id !== id));
            toast.success("Role deleted successfully");
        } catch (error) {
            toast.error("Failed to delete role");
        }
    };

    const handleSaveRole = async (e) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await roleApi.updateRole(editingRole.id, formData);
                toast.success("Role updated successfully");
            } else {
                await roleApi.createRole(formData);
                toast.success("Role created successfully");
            }
            fetchRoles();
            setShowRoleModal(false);
        } catch (error) {
            toast.error("Failed to save role");
        }
    };

    const handleManagePermissions = (role) => {
        setEditingRole(role);
        const currentPermIds = role.permissions ? role.permissions.map(p => p.id) : [];
        setSelectedPerms(currentPermIds);
        setShowPermModal(true);
    };

    const handleSavePermissions = async () => {
        try {
            await roleApi.updateRolePermissions(editingRole.id, selectedPerms);
            toast.success("Permissions updated successfully");
            fetchRoles();
            setShowPermModal(false);
        } catch (error) {
            toast.error("Failed to update permissions");
        }
    };

    const togglePermission = (permId) => {
        setSelectedPerms(prev => {
            if (prev.includes(permId)) {
                return prev.filter(id => id !== permId);
            } else {
                return [...prev, permId];
            }
        });
    };

    const groupedPermissions = (permissions || []).reduce((acc, perm) => {
        const category = perm.key ? perm.key.split('_')[0] : 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(perm);
        return acc;
    }, {});

    return (
        <AdminLayout role={user.role} title="Roles & Permissions">
             <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1 fw-bold">Roles & Permissions</h5>
                        <p className="text-muted small mb-0">Manage roles and their access levels.</p>
                    </div>
                    <button className="btn btn-primary rounded-pill btn-sm px-3 d-flex align-items-center gap-2" onClick={handleCreateRole}>
                        <Plus size={16} /> Create Role
                    </button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Role Name</th>
                                    <th className="py-3 border-0">Description</th>
                                    <th className="py-3 border-0 text-center">Permissions</th>
                                    <th className="py-3 border-0 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                                ) : roles.length > 0 ? (
                                    roles.map(role => (
                                        <tr key={role.id}>
                                            <td className="px-4 fw-bold">{role.name}</td>
                                            <td className="text-muted small">{role.description}</td>
                                            <td className="text-center">
                                                <button className="btn btn-outline-info btn-sm rounded-pill text-info d-inline-flex align-items-center gap-1" onClick={() => handleManagePermissions(role)}>
                                                    <Shield size={12} /> {role.permissions?.length || 0} Permissions
                                                </button>
                                            </td>
                                            <td className="text-end px-4">
                                                <button className="btn btn-light btn-sm rounded-circle me-2" onClick={() => handleEditRole(role)}>
                                                    <Pencil size={14} className="text-secondary" />
                                                </button>
                                                <button className="btn btn-light btn-sm rounded-circle text-danger" onClick={() => handleDeleteRole(role.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-5 text-muted">No roles found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>

             {showRoleModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">{editingRole ? "Edit Role" : "Create Role"}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
                            </div>
                            <form onSubmit={handleSaveRole}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Role Name</label>
                                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowRoleModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
             )}

             {showPermModal && editingRole && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0">
                                <div>
                                    <h5 className="modal-title fw-bold">Manage Permissions</h5>
                                    <p className="text-muted small mb-0">Role: <span className="fw-bold text-primary">{editingRole.name}</span></p>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowPermModal(false)}></button>
                            </div>
                            <div className="modal-body bg-light">
                                <div className="row g-3">
                                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                                        <div className="col-md-6" key={category}>
                                            <div className="card border-0 shadow-sm h-100">
                                                <div className="card-header bg-white fw-bold text-capitalize py-2">
                                                    {category} Management
                                                </div>
                                                <div className="card-body py-2">
                                                    {perms.map(perm => (
                                                        <div key={perm.id} className="form-check mb-2">
                                                            <input className="form-check-input" type="checkbox" id={`perm-${perm.id}`} checked={selectedPerms.includes(perm.id)} onChange={() => togglePermission(perm.id)} />
                                                            <label className="form-check-label" htmlFor={`perm-${perm.id}`}>
                                                                <span className="fw-bold" style={{fontSize: '13px'}}>{perm.name}</span>
                                                                <div className="text-muted" style={{fontSize: '11px'}}>{perm.description}</div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer border-0 bg-white">
                                <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowPermModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleSavePermissions}>
                                    <CheckCircle size={16} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             )}
        </AdminLayout>
    );
};

export default RolesPage;
