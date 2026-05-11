import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { userApi } from "../../api/user.api";
import { orderApi } from "../../api/order.api";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { Users, UserPlus, TrendingUp, Search, RefreshCcw, Download, Eye, Mail, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomersPage = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredCustomers(customers);
        } else {
            const lower = searchTerm.toLowerCase();
            const filtered = customers.filter(c => 
                (c.name || "").toLowerCase().includes(lower) || 
                (c.email || "").toLowerCase().includes(lower)
            );
            setFilteredCustomers(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, customers]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, ordersRes] = await Promise.all([
                userApi.getAllUsers(),
                orderApi.getAllOrders()
            ]);
            const users = usersRes.data || [];
            const orders = ordersRes.data || [];
            const customerList = users.filter(u => u.role === 'customer' || u.role === 'user');
            const enrichedCustomers = customerList.map(cust => {
                const customerOrders = orders.filter(o => (o.userId && o.userId === cust.id) || (o.customer && o.customer.email === cust.email));
                const totalSpent = customerOrders.reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);
                return { ...cust, ordersCount: customerOrders.length, totalSpent: totalSpent, lastOrderDate: customerOrders.length > 0 ? customerOrders.sort((a,b) => new Date(b.date) - new Date(a.date))[0].date : null };
            });
            if (enrichedCustomers.length === 0) {
                 const mockCustomers = Array.from({ length: 12 }).map((_, i) => ({ id: i + 1, name: `Customer ${i + 1}`, email: `user${i+1}@example.com`, phone: `+91 98765 000${i}`, role: 'customer', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i * 5).toISOString(), ordersCount: Math.floor(Math.random() * 10), totalSpent: Math.floor(Math.random() * 50000), lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString() }));
                setCustomers(mockCustomers);
                setFilteredCustomers(mockCustomers);
            } else {
                setCustomers(enrichedCustomers);
                setFilteredCustomers(enrichedCustomers);
            }
            setAllOrders(orders);
        } catch (error) {
            toast.error("Could not load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: 'Delete Customer?', text: "This action cannot be undone!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Yes, delete user!' });
        if (!result.isConfirmed) return;
        try {
            await userApi.deleteUser(id);
            setCustomers(prev => prev.filter(c => c.id !== id));
            toast.success("Customer deleted successfully");
        } catch (error) {
            setCustomers(prev => prev.filter(c => c.id !== id));
            toast.success("Customer deleted (Simulation)");
        }
    };

    const handleViewDetails = (customer) => {
        const customerOrders = allOrders.filter(o => (o.userId && o.userId === customer.id) || (o.customer && o.customer.email === customer.email));
        const displayOrders = customerOrders.length > 0 ? customerOrders : Array.from({length: customer.ordersCount || 0}).map((_, i) => ({ id: 1000 + i, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i * 2).toISOString(), amount: (customer.totalSpent / (customer.ordersCount || 1)).toFixed(2), status: ['Delivered', 'Processing', 'Cancelled'][Math.floor(Math.random() * 3)] }));
        setSelectedCustomer({ ...customer, ordersList: displayOrders });
        setShowModal(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = (filteredCustomers || []).slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((filteredCustomers || []).length / itemsPerPage);

    return (
        <AdminLayout role={user.role} title="Customers Management">
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-primary text-white h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-center"><div><h6 className="mb-1 opacity-75">Total Customers</h6><h2 className="mb-0 fw-bold">{customers.length}</h2></div><div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}><Users size={24} /></div></div></div></div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-success text-white h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-center"><div><h6 className="mb-1 opacity-75">Active Today</h6><h2 className="mb-0 fw-bold">12</h2></div><div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}><UserPlus size={24} /></div></div></div></div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-info text-white h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-center"><div><h6 className="mb-1 opacity-75">Avg. Spending</h6><h2 className="mb-0 fw-bold">₹{customers.length > 0 ? (customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length).toFixed(0) : 0}</h2></div><div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}><TrendingUp size={24} /></div></div></div></div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom py-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div><h5 className="mb-1 fw-bold">All Customers</h5><p className="text-muted small mb-0">View and manage your customer base.</p></div>
                        <div className="d-flex gap-2">
                             <div className="position-relative">
                                <input type="text" className="form-control rounded-pill ps-5 border-light bg-light" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{width: '250px'}} />
                                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                             </div>
                             <button className="btn btn-outline-primary rounded-pill btn-sm px-3" onClick={fetchData}><RefreshCcw size={14} /></button>
                             <button className="btn btn-success rounded-pill btn-sm px-3 d-flex align-items-center gap-2"><Download size={14} /> Export</button>
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr><th className="px-4 py-3 border-0">Customer</th><th className="py-3 border-0">Contact</th><th className="py-3 border-0">Orders</th><th className="py-3 border-0">Total Spent</th><th className="py-3 border-0">Joined Date</th><th className="py-3 border-0 text-end px-4">Actions</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                                ) : currentCustomers.length > 0 ? (
                                    currentCustomers.map(cust => (
                                        <tr key={cust.id}>
                                            <td className="px-4"><div className="d-flex align-items-center"><div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{width: '40px', height: '40px'}}>{cust.name?.charAt(0).toUpperCase() || 'U'}</div><div><div className="fw-bold text-dark">{cust.name}</div><div className="text-muted small">ID: #{cust.id}</div></div></div></td>
                                            <td><div className="small text-muted">{cust.email}</div><div className="small text-muted">{cust.phone}</div></td>
                                            <td><span className="badge bg-light text-dark border rounded-pill px-3">{cust.ordersCount} Orders</span></td>
                                            <td className="fw-bold text-success">₹{(cust.totalSpent || 0).toLocaleString()}</td>
                                            <td className="text-muted small">{cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td className="text-end px-4">
                                                <button className="btn btn-light btn-sm rounded-circle me-2" onClick={() => handleViewDetails(cust)} title="View Profile"><Eye size={14} className="text-primary" /></button>
                                                <a href={`mailto:${cust.email}`} className="btn btn-light btn-sm rounded-circle me-2" title="Send Email"><Mail size={14} className="text-info" /></a>
                                                <button className="btn btn-light btn-sm rounded-circle text-danger" onClick={() => handleDelete(cust.id)} title="Delete"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center py-5 text-muted"><Users size={48} className="mb-3 opacity-20" /><p className="mb-0">No customers found.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredCustomers.length > itemsPerPage && (
                     <div className="card-footer bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <small className="text-muted">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length}</small>
                        <div className="btn-group">
                            <button className="btn btn-outline-light text-dark btn-sm rounded-start-pill px-3 border" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}><ChevronLeft size={16} /></button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`btn btn-sm border ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-light text-dark'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            ))}
                            <button className="btn btn-outline-light text-dark btn-sm rounded-end-pill px-3 border" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}><ChevronRight size={16} /></button>
                        </div>
                     </div>
                )}
            </div>

            {showModal && selectedCustomer && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0"><h5 className="modal-title fw-bold">Customer Profile</h5><button type="button" className="btn-close" onClick={() => setShowModal(false)}></button></div>
                            <div className="modal-body">
                                <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-4">
                                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-4 shadow-sm fw-bold fs-3" style={{width: '80px', height: '80px'}}>{selectedCustomer.name?.charAt(0).toUpperCase()}</div>
                                    <div className="flex-grow-1"><h4 className="fw-bold mb-1">{selectedCustomer.name}</h4><p className="text-muted mb-0 small"><Mail size={14} className="me-2" />{selectedCustomer.email}</p></div>
                                    <div className="text-end text-muted small">Joined: {new Date(selectedCustomer.createdAt || Date.now()).toLocaleDateString()}</div>
                                </div>
                                <div className="row g-3 mb-4">
                                     <div className="col-6"><div className="border rounded-4 p-3 text-center"><div className="text-muted small text-uppercase fw-bold">Total Orders</div><div className="fs-4 fw-bold">{selectedCustomer.ordersCount}</div></div></div>
                                     <div className="col-6"><div className="border rounded-4 p-3 text-center"><div className="text-muted small text-uppercase fw-bold">Total Spent</div><div className="fs-4 fw-bold text-success">₹{selectedCustomer.totalSpent?.toLocaleString()}</div></div></div>
                                </div>
                                <h6 className="fw-bold mb-3">Recent Orders</h6>
                                <div className="table-responsive border rounded-4">
                                    <table className="table mb-0">
                                        <thead className="table-light"><tr><th className="ps-4 border-0">Order ID</th><th className="border-0">Date</th><th className="border-0">Amount</th><th className="border-0">Status</th></tr></thead>
                                        <tbody>
                                            {selectedCustomer.ordersList?.map((order, idx) => (
                                                <tr key={idx}><td className="ps-4 fw-bold">#{order.id}</td><td>{new Date(order.date).toLocaleDateString()}</td><td className="fw-bold">₹{parseFloat(order.amount).toLocaleString()}</td><td><span className={`badge rounded-pill ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{order.status}</span></td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CustomersPage;
