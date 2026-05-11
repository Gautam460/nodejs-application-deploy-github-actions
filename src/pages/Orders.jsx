import React, { useEffect, useState } from "react";
import { Navbar, Footer } from "../components";
import { Link } from "react-router-dom";
import { api } from "../utils/api";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                if (response && response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container py-5 text-center" style={{minHeight: '70vh'}}>
                    <h2>Loading Orders...</h2>
                </div>
                <Footer />
            </>
        )
    }

    if (orders.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container py-5 text-center" style={{minHeight: '70vh'}}>
                     <h2 className="fw-bold mb-4">No Orders Found</h2>
                     <Link to="/" className="btn btn-dark">Start Shopping</Link>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="container py-5" style={{minHeight: '70vh'}}>
                <h2 className="fw-bold mb-5 text-uppercase text-center" style={{letterSpacing: '2px'}}>Order History</h2>
                
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {orders.map((order) => (
                            <div className="card mb-4 border-0 shadow-sm rounded-0" key={order.id}>
                                <div className="card-header bg-dark text-white border-bottom p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="d-flex flex-wrap gap-4 text-uppercase small fw-bold text-white-50" style={{letterSpacing: '1px'}}>
                                        <div>
                                            <div className="mb-1" style={{fontSize: '0.65rem'}}>Order Placed</div>
                                            <div className="text-white">{formatDate(order.createdAt)}</div>
                                        </div>
                                        <div>
                                            <div className="mb-1" style={{fontSize: '0.65rem'}}>Total</div>
                                            <div className="text-white"><i className="fa fa-inr"></i> {order.totalAmount}</div>
                                        </div>
                                        <div>
                                            <div className="mb-1" style={{fontSize: '0.65rem'}}>Ship To</div>
                                            <div className="text-white">{order.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="small fw-bold text-white mb-1">Order # {order.id}</div> 
                                        <div className="d-flex gap-3 justify-content-end small">
                                            <button className="btn btn-sm btn-link text-decoration-none text-white-50 underline-on-hover p-0">Detailed View</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    {order.items && order.items.map((item, i) => (
                                        <div className="row align-items-center mb-3 border-bottom pb-3 last-child-no-border" key={i}>
                                            <div className="col-md-2 mb-3 mb-md-0">
                                                <img src={item.image || "https://uia.org.in/static/media/default.7c46a645.jpg"} alt={item.title} className="img-fluid rounded-0 shadow-sm" style={{height: '80px', width: '80px', objectFit: 'contain'}} />
                                            </div>
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <h5 className="fw-bold text-success text-uppercase fs-6 mb-2" style={{letterSpacing: '1px'}}>{order.status}</h5>
                                                <Link to={`/product/${item.productId}`} className="text-dark fw-bold text-decoration-none hover-opacity d-block mb-1">{item.title || `Product #${item.productId}`}</Link>
                                                <p className="small text-muted mb-0">Qty: {item.quantity} x <i className="fa fa-inr"></i> {item.price}</p>
                                            </div>
                                            <div className="col-md-4 text-md-end d-flex flex-column gap-2 align-items-md-end justify-content-center">
                                                <button className="btn btn-outline-dark btn-sm text-uppercase fw-bold px-4 rounded-0" style={{letterSpacing: '1px'}}>Write Review</button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!order.items || order.items.length === 0) && <p>No items info available.</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Orders;
