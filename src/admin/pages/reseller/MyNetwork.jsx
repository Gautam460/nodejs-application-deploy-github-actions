
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { resellerApi } from "../../../api/reseller.api";

const MyNetwork = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [network, setNetwork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [referralCode, setReferralCode] = useState(user.referralCode || '');

    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                if (user.id) {
                    const res = await resellerApi.getNetwork(user.id);
                    setNetwork(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch network", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNetwork();
    }, [user.id]);
    
    const generateCode = async () => {
        try {
            const res = await resellerApi.generateCode(user.id);
            setReferralCode(res.data.code);
            // Update local storage
            const updatedUser = { ...user, referralCode: res.data.code };
            localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Failed to generate code", error);
        }
    };

    return (
        <AdminLayout role={user.role} title="My Network">
            <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: 'linear-gradient(135deg, #1e1e2d 0%, #2c2c3e 100%)', color: 'white' }}>
                <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1">Your Referral Code</h5>
                        {referralCode ? (
                            <h2 className="mb-0 fw-bold font-monospace text-primary">{referralCode}</h2>
                        ) : (
                            <p className="mb-0 text-white-50">Generate a code to start referring.</p>
                        )}
                    </div>
                    {!referralCode && (
                        <button className="btn btn-primary" onClick={generateCode}>Generate Code</button>
                    )}
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold">My Downline ({network.length})</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0">Name</th>
                                    <th className="py-3 border-0">Email</th>
                                    <th className="py-3 border-0">Joined Date</th>
                                    <th className="py-3 border-0">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-5">Loading network...</td></tr>
                                ) : network.length > 0 ? (
                                    network.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-4 fw-bold">{member.name}</td>
                                            <td>{member.email}</td>
                                            <td className="text-muted">{new Date(member.joinedAt).toLocaleDateString()}</td>
                                            <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Active</span></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            <p className="mb-0">You haven't referred anyone yet.</p>
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

export default MyNetwork;
