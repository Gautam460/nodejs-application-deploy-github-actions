import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import toast from "react-hot-toast";
import { Settings, CreditCard, Bell, Shield, Save, Loader2, IndianRupee, Handshake, Mail, Phone, MapPin } from 'lucide-react';

const SettingsPage = () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    const [generalSettings, setGeneralSettings] = useState({
        storeName: "Prince Collection",
        supportEmail: "support@princecollection.com",
        supportPhone: "+91 98765 43210",
        address: "123 Business Park, Mumbai, India",
        currency: "INR",
        timezone: "Asia/Kolkata"
    });

    const [paymentSettings, setPaymentSettings] = useState({
        stripeEnabled: true,
        paypalEnabled: false,
        razorpayEnabled: true,
        codEnabled: true,
        currencySymbol: "₹"
    });

    const [notificationSettings, setNotificationSettings] = useState({
        orderConfirmation: true,
        shippingUpdates: true,
        promotionalEmails: false,
        lowStockAlerts: true
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully!");
        }, 1000);
    };

    return (
        <AdminLayout role={user.role} title="System Settings">
            <div className="row">
                <div className="col-lg-3 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="list-group list-group-flush">
                            <button 
                                className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'general' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setActiveTab('general')}
                            >
                                <Settings size={18} className={`me-3 ${activeTab === 'general' ? '' : 'text-muted'}`} />
                                General Settings
                            </button>
                            <button 
                                className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'payment' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setActiveTab('payment')}
                            >
                                <CreditCard size={18} className={`me-3 ${activeTab === 'payment' ? '' : 'text-muted'}`} />
                                Payment Methods
                            </button>
                            <button 
                                className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'notification' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setActiveTab('notification')}
                            >
                                <Bell size={18} className={`me-3 ${activeTab === 'notification' ? '' : 'text-muted'}`} />
                                Notifications
                            </button>
                            <button 
                                className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'security' ? 'bg-primary text-white' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <Shield size={18} className={`me-3 ${activeTab === 'security' ? '' : 'text-muted'}`} />
                                Security
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-9">
                    <form onSubmit={handleSave}>
                        {activeTab === 'general' && (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold">General Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small text-muted">Store Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={generalSettings.storeName}
                                                onChange={(e) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small text-muted">Support Email</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted" /></span>
                                                <input 
                                                    type="email" 
                                                    className="form-control border-start-0 ps-0" 
                                                    value={generalSettings.supportEmail}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small text-muted">Support Phone</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-muted" /></span>
                                                <input 
                                                    type="text" 
                                                    className="form-control border-start-0 ps-0" 
                                                    value={generalSettings.supportPhone}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold small text-muted">Currency</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0"><IndianRupee size={16} className="text-muted" /></span>
                                                <select 
                                                    className="form-select border-start-0 ps-0" 
                                                    value={generalSettings.currency}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                                                >
                                                    <option value="INR">INR (₹)</option>
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold small text-muted">Business Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0"><MapPin size={16} className="text-muted" /></span>
                                                <textarea 
                                                    className="form-control border-start-0 ps-0" 
                                                    rows="3"
                                                    value={generalSettings.address}
                                                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0 py-4 text-end">
                                    <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 d-flex align-items-center gap-2 ms-auto" disabled={loading}>
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold">Payment Methods</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 mb-3 hover-shadow-sm transition-all">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">Stripe Payment</h6>
                                                    <small className="text-muted">Accept credit cards via Stripe</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={paymentSettings.stripeEnabled}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, stripeEnabled: e.target.checked})}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 mb-3 hover-shadow-sm transition-all">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-info bg-opacity-10 p-2 rounded me-3 text-info">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">PayPal</h6>
                                                    <small className="text-muted">Accept payments via PayPal</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={paymentSettings.paypalEnabled}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, paypalEnabled: e.target.checked})}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 mb-3 hover-shadow-sm transition-all">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-warning bg-opacity-10 p-2 rounded me-3 text-warning">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">Razorpay</h6>
                                                    <small className="text-muted">Indian payment gateway</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={paymentSettings.razorpayEnabled}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpayEnabled: e.target.checked})}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 hover-shadow-sm transition-all">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-success bg-opacity-10 p-2 rounded me-3 text-success">
                                                    <Handshake size={24} />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">Cash on Delivery</h6>
                                                    <small className="text-muted">Pay when order arrives</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={paymentSettings.codEnabled}
                                                    onChange={(e) => setPaymentSettings({...paymentSettings, codEnabled: e.target.checked})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0 py-4 text-end">
                                    <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 d-flex align-items-center gap-2 ms-auto" disabled={loading}>
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notification' && (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold">Notification Preferences</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <div className="form-check form-switch mb-3">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={notificationSettings.orderConfirmation}
                                                onChange={(e) => setNotificationSettings({...notificationSettings, orderConfirmation: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-bold">Order Confirmation Emails</label>
                                            <div className="text-muted small ms-0">Send an email to customers when they place an order.</div>
                                        </div>
                                        <hr className="opacity-10" />
                                        <div className="form-check form-switch mb-3">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={notificationSettings.shippingUpdates}
                                                onChange={(e) => setNotificationSettings({...notificationSettings, shippingUpdates: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-bold">Shipping Updates</label>
                                            <div className="text-muted small ms-0">Notify customers when their order status changes.</div>
                                        </div>
                                        <hr className="opacity-10" />
                                        <div className="form-check form-switch mb-3">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={notificationSettings.lowStockAlerts}
                                                onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlerts: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-bold">Low Stock Alerts</label>
                                            <div className="text-muted small ms-0">Notify admin when product stock is low.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0 py-4 text-end">
                                    <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 d-flex align-items-center gap-2 ms-auto" disabled={loading}>
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                             <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="mb-0 fw-bold">Security Settings</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Admin Panel Access</label>
                                        <select className="form-select mb-3">
                                            <option>All Admins & Super Admins</option>
                                            <option>Super Admins Only</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Minimum Password Length</label>
                                        <input type="number" className="form-control" defaultValue={8} />
                                    </div>
                                     <div className="form-check form-switch mb-3">
                                        <input className="form-check-input" type="checkbox" defaultChecked />
                                        <label className="form-check-label fw-bold">Require Two-Factor Authentication (2FA)</label>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-0 py-4 text-end">
                                    <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 d-flex align-items-center gap-2 ms-auto" disabled={loading}>
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage;
