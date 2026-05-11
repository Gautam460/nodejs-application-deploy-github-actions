
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { resellerApi } from "../../../api/reseller.api";

const MySales = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [sales, setSales] = useState([]);
    const [totalCommission, setTotalCommission] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                if (user.id) {
                    const res = await resellerApi.getSales(user.id);
                    setSales(res.data);
                    const total = res.data.reduce((acc, sale) => acc + parseFloat(sale.amount), 0);
                    setTotalCommission(total);
                }
            } catch (error) {
                console.error("Failed to fetch sales", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, [user.id]);

    return (
        <AdminLayout role={user.role} title="My Sales">
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-primary text-white">
                        <div className="card-body p-4">
                            <h6 className="opacity-75 mb-2">Total Earnings</h6>
                            <h2 className="display-6 fw-bold mb-0">₹{totalCommission.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h6 className="text-muted mb-2">Total Sales Count</h6>
                            <h2 className="display-6 fw-bold mb-0">{sales.length}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">
                     <div className="card-header bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold">Commission History</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Date</th>
                                    <th className="py-3 border-0">Order ID</th>
                                    <th className="py-3 border-0">Customer</th>
                                    <th className="py-3 border-0 text-success fw-bold">Commission</th>
                                    <th className="py-3 border-0 text-end">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5">Loading sales...</td></tr>
                                ) : sales.length > 0 ? (
                                    sales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td className="px-4 text-muted small">{new Date(sale.date).toLocaleDateString()}</td>
                                            <td className="fw-bold">#{sale.orderId}</td>
                                            <td>{sale.customerName || 'Unknown'}</td>
                                            <td className="text-success fw-bold">₹{parseFloat(sale.amount).toFixed(2)}</td>
                                            <td className="text-end">
                                                <span className={`badge rounded-pill px-3 ${sale.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'} bg-opacity-10`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <p className="mb-0">No sales yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MySales;
