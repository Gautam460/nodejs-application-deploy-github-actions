
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { resellerApi } from "../../../api/reseller.api";
import Swal from 'sweetalert2';

const Payouts = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayouts();
    }, [user.id]);

    const fetchPayouts = async () => {
        try {
            if (user.id) {
                const res = await resellerApi.getPayouts(user.id);
                setPayouts(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch payouts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPayout = async () => {
        const { value: amount } = await Swal.fire({
            title: 'Request Payout',
            input: 'number',
            inputLabel: 'Amount',
            inputPlaceholder: 'Enter amount to withdraw',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) return 'You need to write an amount!';
                if (value <= 0) return 'Amount must be positive!';
            }
        });

        if (amount) {
            try {
                await resellerApi.requestPayout(user.id, amount);
                Swal.fire('Success', `Payout of ₹${amount} requested!`, 'success');
                fetchPayouts();
            } catch (error) {
                Swal.fire('Error', 'Failed to request payout', 'error');
            }
        }
    };

    return (
        <AdminLayout role={user.role} title="Payouts">
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Payout Requests</h5>
                    <button className="btn btn-primary rounded-pill px-4" onClick={handleRequestPayout}>
                        <i className="fa fa-plus me-2"></i> Request Payout
                    </button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Date</th>
                                    <th className="py-3 border-0">Amount</th>
                                    <th className="py-3 border-0">Method</th>
                                    <th className="py-3 border-0">Status</th>
                                    <th className="py-3 border-0 text-end">Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5">Loading history...</td></tr>
                                ) : payouts.length > 0 ? (
                                    payouts.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 text-muted small">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="fw-bold fs-5">₹{parseFloat(item.amount).toFixed(2)}</td>
                                            <td>{item.method}</td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${
                                                    item.status === 'Processed' ? 'bg-success bg-opacity-10 text-success' : 
                                                    item.status === 'Pending' ? 'bg-warning bg-opacity-10 text-dark' : 'bg-danger bg-opacity-10 text-danger'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="text-end small font-monospace text-muted">
                                                {item.transactionReference || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <p className="mb-0">No stats found.</p>
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

export default Payouts;
