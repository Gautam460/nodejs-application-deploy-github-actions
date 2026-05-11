import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { Plus, Star, Pencil, Trash2, Inbox, Save } from 'lucide-react';
import { productApi } from "../../api/product.api";
import { categoryApi } from "../../api/category.api";

const ProductsPage = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageMethod, setImageMethod] = useState('url'); // 'url' or 'upload'
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    ratingRate: 4.5,
    ratingCount: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const fetchProducts = async () => {
    try {
      let response;
      if (categoryFilter && categoryFilter !== 'all') {
        response = await productApi.getProductsByCategory(categoryFilter);
      } else {
        response = await productApi.getAllProducts();
      }
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingProduct) {
        response = await productApi.updateProduct(editingProduct.id, formData);
      } else {
        response = await productApi.createProduct(formData);
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(editingProduct ? 'Product updated!' : 'Product added!');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error('Failed to save product');
      }
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      image: product.image || '',
      ratingRate: product.ratingRate || 4.5,
      ratingCount: product.ratingCount || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      const response = await productApi.deleteProduct(id);
      if (response.status === 200) {
        toast.success('Product deleted!');
        fetchProducts();
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
      Swal.fire('Error', 'Failed to delete product', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', description: '', category: '', image: '', ratingRate: 4.5, ratingCount: 0 });
    setEditingProduct(null);
    setImageMethod('url');
    setImageFile(null);
  };

  return (
    <AdminLayout role={user.role} title="Products Management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Products</h4>
          <p className="text-muted mb-0">Manage your product catalog</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setLoading(true); }}>
            <option value="all">All Categories</option>
            {categories.map(c => (<option key={c.id} value={c.slug}>{c.name}</option>))}
          </select>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 px-4">Image</th>
                    <th className="border-0">Product</th>
                    <th className="border-0">Category</th>
                    <th className="border-0">Price</th>
                    <th className="border-0">Rating</th>
                    <th className="border-0 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? products.map(product => (
                    <tr key={product.id}>
                      <td className="px-4">
                        <img src={product.image} alt={product.title} className="rounded" style={{width: '60px', height: '60px', objectFit: 'cover'}} onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                      </td>
                      <td>
                        <div className="fw-bold" style={{fontSize: '14px'}}>{product.title}</div>
                        <div className="small text-muted text-truncate" style={{maxWidth: '300px', fontSize: '12px'}}>{product.description}</div>
                      </td>
                      <td>
                        <span className="badge bg-info bg-opacity-10 text-info" style={{fontSize: '11px'}}>{product.category || 'Uncategorized'}</span>
                      </td>
                      <td className="fw-bold text-success" style={{fontSize: '14px'}}>₹{parseFloat(product.price).toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Star size={12} className="text-warning fill-warning" />
                          <span className="fw-bold" style={{fontSize: '13px'}}>{product.ratingRate}</span>
                          <span className="text-muted small" style={{fontSize: '11px'}}>({product.ratingCount})</span>
                        </div>
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-light rounded-circle me-2" onClick={() => handleEdit(product)} title="Edit">
                          <Pencil size={14} className="text-primary" />
                        </button>
                        <button className="btn btn-sm btn-light rounded-circle" onClick={() => handleDelete(product.id)} title="Delete">
                          <Trash2 size={14} className="text-danger" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <Inbox size={48} className="mb-3 opacity-20" />
                        <p>No products found. Add your first product!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">Product Title *</label>
                      <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter product name" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Price *</label>
                      <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required step="0.01" placeholder="0.00" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Category</label>
                      <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="">Uncategorized</option>
                        {categories.map(c => (<option key={c.id} value={c.slug}>{c.name}</option>))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Description</label>
                      <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Product description..."></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Image Method</label>
                      <select className="form-select mb-3" value={imageMethod} onChange={(e) => setImageMethod(e.target.value)}>
                        <option value="url">Image URL</option>
                        <option value="upload">Upload Image</option>
                      </select>
                      {imageMethod === 'url' ? (
                        <input type="url" className="form-control" name="image" value={formData.image} onChange={handleInputChange} required={imageMethod === 'url'} placeholder="https://example.com/image.jpg" />
                      ) : (
                        <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required={!formData.image && imageMethod === 'upload'} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2">
                    <Save size={18} /> {editingProduct ? 'Update Product' : 'Add Product'}
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

export default ProductsPage;
