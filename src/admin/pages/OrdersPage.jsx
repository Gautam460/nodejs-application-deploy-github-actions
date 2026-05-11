import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { orderApi } from "../../api/order.api";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { RefreshCcw, Download, Search, Eye, Pencil, Trash2, Inbox, ChevronLeft, ChevronRight, Printer } from 'lucide-react';

const OrdersPage = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== "All") {
      result = result.filter(order => order.status === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(lower) || 
        (order.customer?.name?.toLowerCase() || "").includes(lower) ||
        (order.customer?.email?.toLowerCase() || "").includes(lower)
      );
    }
    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders();
      if (response.data && response.data.length > 0) {
        setOrders(response.data);
      } else {
        const mockOrders = Array.from({ length: 15 }).map((_, i) => ({
          id: 1000 + i,
          customer: {
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            phone: `+91 98765 000${i}`
          },
          products: [
            { id: 101, title: "Premium T-Shirt", quantity: 2, price: 599 },
            { id: 102, title: "Denim Jeans", quantity: 1, price: 1299 }
          ],
          amount: 2497,
          paymentMethod: i % 2 === 0 ? "Credit Card" : "COD",
          status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 5)],
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
        }));
        setOrders(mockOrders);
      }
    } catch (error) {
      const mockOrders = Array.from({ length: 15 }).map((_, i) => ({
          id: 1000 + i,
          customer: {
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            phone: `+91 98765 000${i}`
          },
          products: [
            { id: 101, title: "Premium T-Shirt", quantity: 2, price: 599 }
          ],
          amount: 1198,
          paymentMethod: "UPI",
          status: ['Pending', 'Processing', 'Shipped', 'Delivered'][Math.floor(Math.random() * 4)],
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
        }));
        setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderApi.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order #${id} status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await orderApi.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      Swal.fire('Deleted!', 'Order has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to delete order', 'error');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning bg-opacity-10 text-warning';
      case 'Processing': return 'bg-info bg-opacity-10 text-info';
      case 'Shipped': return 'bg-primary bg-opacity-10 text-primary';
      case 'Delivered': return 'bg-success bg-opacity-10 text-success';
      case 'Cancelled': return 'bg-danger bg-opacity-10 text-danger';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer Name", "Customer Email", "Date", "Items Count", "Status", "Total Amount"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => {
        const row = [order.id, `"${order.customer?.name || ''}"`, `"${order.customer?.email || ''}"`, new Date(order.date).toLocaleDateString(), (order.products || []).length, order.status, order.amount];
        return row.join(",");
      })
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'orders_export.csv');
    linkElement.style.visibility = 'hidden';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  return (
    <AdminLayout role={user.role} title="Orders Management">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-bottom py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
               <h5 className="mb-1 fw-bold">All Orders ({orders.length})</h5>
               <p className="text-muted small mb-0">Manage and track all customer orders here.</p>
            </div>
            <div className="d-flex gap-2">
                 <button className="btn btn-outline-primary rounded-pill btn-sm px-3 d-flex align-items-center gap-2" onClick={fetchOrders}>
                    <RefreshCcw size={14} /> Refresh
                 </button>
                 <button className="btn btn-success rounded-pill btn-sm px-3 d-flex align-items-center gap-2" onClick={handleExportCSV}>
                    <Download size={14} /> Export CSV
                 </button>
            </div>
          </div>
        </div>

        <div className="card-body border-bottom bg-light bg-opacity-10 py-3">
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="position-relative">
                        <input type="text" className="form-control rounded-pill ps-5 border-0 shadow-sm" placeholder="Search Order ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                </div>
                <div className="col-md-3">
                    <select className="form-select rounded-pill border-0 shadow-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 border-0">Order ID</th>
                  <th className="py-3 border-0">Customer</th>
                  <th className="py-3 border-0">Items</th>
                  <th className="py-3 border-0">Date</th>
                  <th className="py-3 border-0">Total</th>
                  <th className="py-3 border-0">Status</th>
                  <th className="py-3 border-0 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                ) : currentOrders.length > 0 ? (
                    currentOrders.map(order => (
                        <tr key={order.id}>
                            <td className="px-4 fw-bold">#{order.id}</td>
                            <td>
                                <div className="d-flex flex-column">
                                    <span className="fw-bold text-dark">{order.customer?.name || "Unknown Customer"}</span>
                                    <span className="text-muted small">{order.customer?.email || "No Email"}</span>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-light text-dark border">
                                    {(order.products || []).length} Items
                                </span>
                            </td>
                            <td className="text-muted small">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="fw-bold text-success">₹{(order.amount || 0).toFixed(2)}</td>
                            <td><span className={`badge rounded-pill px-3 py-2 ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                            <td className="text-end px-4">
                                <div className="dropdown d-inline-block">
                                    <button className="btn btn-light btn-sm rounded-circle me-2" onClick={() => handleViewDetails(order)} title="View Details">
                                        <Eye size={14} className="text-primary" />
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle me-2 dropdown-toggle-hide-arrow" data-bs-toggle="dropdown">
                                        <Pencil size={14} className="text-secondary" />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                                        <li><h6 className="dropdown-header">Update Status</h6></li>
                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(order.id, 'Pending')}>Pending</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(order.id, 'Processing')}>Processing</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(order.id, 'Shipped')}>Shipped</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(order.id, 'Delivered')}>Delivered</button></li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li><button className="dropdown-item text-danger" onClick={() => handleStatusChange(order.id, 'Cancelled')}>Cancelled</button></li>
                                    </ul>
                                    <button className="btn btn-light btn-sm rounded-circle text-danger" onClick={() => handleDelete(order.id)} title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                            <Inbox size={48} className="mb-3 opacity-20" />
                            <p className="mb-0">No orders found.</p>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length > itemsPerPage && (
             <div className="card-footer bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <small className="text-muted">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}</small>
                <div className="btn-group">
                    <button className="btn btn-outline-light text-dark btn-sm rounded-start-pill px-3 border" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                        <ChevronLeft size={16} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} className={`btn btn-sm border ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-light text-dark'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button className="btn btn-outline-light text-dark btn-sm rounded-end-pill px-3 border" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                        <ChevronRight size={16} />
                    </button>
                </div>
             </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header border-0 pb-0">
                        <div>
                            <h5 className="modal-title fw-bold">Order #{selectedOrder.id}</h5>
                            <span className="text-muted small">{new Date(selectedOrder.date).toLocaleString()}</span>
                        </div>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <h6 className="fw-bold mb-3">Customer Details</h6>
                                <div className="d-flex flex-column gap-2 text-muted small">
                                    <div className="fw-bold text-dark">{selectedOrder.customer?.name}</div>
                                    <div>{selectedOrder.customer?.email}</div>
                                    <div>{selectedOrder.customer?.phone}</div>
                                </div>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <h6 className="fw-bold mb-3">Payment Info</h6>
                                <div className="text-muted small">Method: <span className="fw-bold text-dark">{selectedOrder.paymentMethod}</span></div>
                                <div className="text-muted small">Total: <span className="fw-bold text-success">₹{selectedOrder.amount.toFixed(2)}</span></div>
                            </div>
                            <div className="col-12">
                                <h6 className="fw-bold mb-3">Order Items</h6>
                                <div className="table-responsive bg-light rounded-3 p-3">
                                    <table className="table table-borderless mb-0">
                                        <thead><tr className="border-bottom"><th>Product</th><th className="text-center">Qty</th><th className="text-end">Price</th><th className="text-end">Total</th></tr></thead>
                                        <tbody>
                                            {selectedOrder.products.map(item => (
                                                <tr key={item.id}><td>{item.title}</td><td className="text-center">{item.quantity}</td><td className="text-end">₹{item.price?.toFixed(2)}</td><td className="text-end fw-bold">₹{(item.price * item.quantity).toFixed(2)}</td></tr>
                                            ))}
                                            <tr className="border-top"><td colSpan="3" className="text-end fw-bold pt-3">Subtotal</td><td className="text-end pt-3">₹{selectedOrder.amount.toFixed(2)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Close</button>
                        <button type="button" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => window.print()}>
                            <Printer size={16} /> Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersPage;
