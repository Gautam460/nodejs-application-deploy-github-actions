import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { orderApi } from "../../api/order.api";
import { RefreshCcw, Search, Image as ImageIcon, Trash2, Filter, Inbox } from "lucide-react";

const CustomOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
      let result = orders;
      if(statusFilter !== "All") {
          result = result.filter(o => (o.status || 'Pending') === statusFilter);
      }
      if(searchTerm) {
          const lower = searchTerm.toLowerCase();
          result = result.filter(o => 
              (o.id && o.id.toString().includes(lower)) || 
              (o.userEmail && o.userEmail.toLowerCase().includes(lower)) ||
              (o.productType && o.productType.toLowerCase().includes(lower))
          );
      }
      setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getCustomOrders();
      if (response.data) {
        setOrders(response.data);
        setFilteredOrders(response.data);
      }
    } catch (error) {
      toast.error("Failed to load custom orders");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
      });
      if(!result.isConfirmed) return;
      try {
          const response = await orderApi.deleteCustomOrder(id);
          if(response.status === 200) {
              setOrders(prev => prev.filter(o => o.id !== id));
              toast.success("Order deleted successfully");
          } else {
              toast.error("Failed to delete order");
          }
      } catch(error) {
          toast.error("Error deleting order");
      }
  };

  const updateStatus = async (id, newStatus) => {
      try {
          const response = await orderApi.updateCustomOrderStatus(id, newStatus);
          if(response.status === 200) {
              setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
              toast.success(`Status updated to ${newStatus}`);
          } else {
              toast.error("Failed to update status");
          }
      } catch(error) {
         toast.error("Error updating status");
      }
  };

  return (
    <AdminLayout role={user.role} title="Custom Orders">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
             <h5 className="mb-0 fw-bold">All Custom Orders</h5>
             <button className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-2 px-3" onClick={fetchOrders}>
                 <RefreshCcw size={14} /> Refresh
             </button>
          </div>
          <div className="row g-2">
              <div className="col-md-4">
                  <div className="position-relative">
                      <input type="text" className="form-control ps-5 rounded-pill bg-light border-0" placeholder="Search ID, Email or Type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  </div>
              </div>
              <div className="col-md-3">
                  <select className="form-select rounded-pill bg-light border-0" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                  </select>
              </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 px-4">Order ID</th>
                    <th className="border-0">Preview</th>
                    <th className="border-0">User Info</th>
                    <th className="border-0">Details</th>
                    <th className="border-0">Price</th>
                    <th className="border-0">Status (Edit)</th>
                    <th className="border-0 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? filteredOrders.map(order => {
                    const measurements = typeof order.measurements === 'string' ? JSON.parse(order.measurements || '{}') : order.measurements;
                    return (
                      <tr key={order.id}>
                        <td className="px-4 fw-bold">#{order.id}</td>
                        <td>
                             <div className="bg-light rounded border d-flex align-items-center justify-content-center overflow-hidden" style={{width: 50, height: 60}}>
                                 {order.designImage ? (
                                     <img src={order.designImage} alt="Design" className="w-100 h-100 object-fit-contain" />
                                 ) : (
                                     <ImageIcon size={20} className="text-muted" />
                                 )}
                             </div>
                        </td>
                        <td><div className="d-flex flex-column"><span className="fw-bold text-dark" style={{fontSize: '13px'}}>{order.userEmail}</span><span className="text-muted small">User ID: {order.userId || 'Guest'}</span></div></td>
                        <td>
                          <div className="small">
                            <div><span className="badge bg-dark me-1 text-capitalize">{order.productType}</span></div>
                            <div className="text-muted mt-1">{order.designPattern}, {order.fit}</div>
                             <div className="text-muted d-none d-md-block text-truncate" style={{maxWidth: '150px'}} title="Measurements...">Chest: {measurements?.chest}, Waist: {measurements?.waist}...</div>
                          </div>
                        </td>
                        <td className="fw-bold text-success">₹{parseFloat(order.totalPrice || 0).toFixed(2)}</td>
                        <td>
                          <select className={`form-select form-select-sm border-0 fw-bold ${(order.status || 'Pending') === 'Completed' ? 'text-success bg-success-subtle' : (order.status || 'Pending') === 'Processing' ? 'text-warning bg-warning-subtle' : 'text-secondary bg-secondary-subtle'}`} style={{width: '130px'}} value={order.status || 'Pending'} onChange={(e) => updateStatus(order.id, e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="text-end px-4">
                            <button className="btn btn-sm btn-light text-danger rounded-circle border hover-shadow" onClick={() => deleteOrder(order.id)} title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <Inbox size={48} className="mb-3 opacity-20" />
                        <p>No custom orders found matching your filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomOrdersPage;
