import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { categoryApi } from "../../api/category.api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, Save } from 'lucide-react';

const CategoriesPage = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: "", slug: "", parentId: 0, active: 1 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoryApi.getAllCategories();
            setCategories(res.data || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditing(null);
        setFormData({ name: "", slug: "", parentId: 0, active: 1 });
        setShowModal(true);
    };

    const handleEdit = (cat) => {
        setEditing(cat);
        setFormData({ name: cat.name, slug: cat.slug, parentId: cat.parentId || 0, active: cat.active });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!result.isConfirmed) return;
        try {
            await categoryApi.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await categoryApi.updateCategory(editing.id, formData);
                toast.success("Category updated");
            } else {
                await categoryApi.createCategory(formData);
                toast.success("Category created");
            }
            fetchCategories();
            setShowModal(false);
        } catch (error) {
            toast.error("Failed to save category");
        }
    };

    return (
        <AdminLayout role={user.role} title="Category Master">
             <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1 fw-bold">Category Master</h5>
                        <p className="text-muted small mb-0">Create and manage product categories (hierarchical).</p>
                    </div>
                    <button className="btn btn-primary rounded-pill btn-sm px-3 d-flex align-items-center gap-2" onClick={handleCreate}>
                        <Plus size={16} /> Create Category
                    </button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Name</th>
                                    <th className="py-3 border-0">Slug</th>
                                    <th className="py-3 border-0">Parent</th>
                                    <th className="py-3 border-0 text-center">Active</th>
                                    <th className="py-3 border-0 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                                ) : categories.length > 0 ? (
                                    categories.map(cat => (
                                        <tr key={cat.id}>
                                            <td className="px-4 fw-bold">{cat.name}</td>
                                            <td className="text-muted">{cat.slug}</td>
                                            <td className="text-muted">{(categories.find(c => c.id === cat.parentId) || {}).name || '—'}</td>
                                            <td className="text-center">{cat.active ? 'Yes' : 'No'}</td>
                                            <td className="text-end px-4">
                                                <button className="btn btn-light btn-sm rounded-circle me-2" onClick={() => handleEdit(cat)}>
                                                    <Pencil size={14} className="text-secondary" />
                                                </button>
                                                <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleDelete(cat.id)}>
                                                    <Trash2 size={14} className="text-danger" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center py-5">No categories found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>

             {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">{editing ? "Edit Category" : "Create Category"}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Slug</label>
                                        <input type="text" className="form-control" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Parent Category</label>
                                        <select className="form-select" value={formData.parentId} onChange={e => setFormData({...formData, parentId: parseInt(e.target.value)})}>
                                            <option value={0}>No parent (Top-level)</option>
                                            {categories.filter(c => c.id !== (editing?.id || 0)).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" id="activeCheck" checked={!!formData.active} onChange={e => setFormData({...formData, active: e.target.checked ? 1 : 0})} />
                                        <label className="form-check-label" htmlFor="activeCheck">Active</label>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2">
                                        <Save size={18} /> Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
             )}
        </AdminLayout>
    );
};

export default CategoriesPage;
