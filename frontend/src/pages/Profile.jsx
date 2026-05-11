import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import { deleteWishlist } from "../redux/slices/wishlistSlice";
import toast from "react-hot-toast";

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [customOrders, setCustomOrders] = useState([]);
    const [loadingCustom, setLoadingCustom] = useState(false);
    const wishlist = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data");
                navigate('/login');
            }
        } else {
            // If no user is logged in, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (activeTab === "custom") {
            fetchCustomOrders();
        }
    }, [activeTab]);

    const fetchCustomOrders = async () => {
        setLoadingCustom(true);
        try {
            const response = await fetch("http://localhost:5000/api/custom-orders");
            if (response.ok) {
                const data = await response.json();
                setCustomOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch custom orders", error);
        } finally {
            setLoadingCustom(false);
        }
    };

    const addToCart = (product) => {
        dispatch(addItem(product));
        toast.success("Added to Cart");
    };

    const removeFromWishlist = (product) => {
        dispatch(deleteWishlist(product));
        toast.error("Removed from Wishlist");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    if (!user) {
        return null; // Or a loading spinner
    }

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="card border-0 shadow-sm rounded-0">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold text-uppercase tracking-wide">My Profile</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="small text-muted text-uppercase fw-bold mb-1">Full Name</label>
                                    <div className="p-3 bg-light rounded-2 fw-medium">{user.name || "N/A"}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="small text-muted text-uppercase fw-bold mb-1">Email Address</label>
                                    <div className="p-3 bg-light rounded-2 fw-medium">{user.email || "N/A"}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="small text-muted text-uppercase fw-bold mb-1">User ID</label>
                                    <div className="p-3 bg-light rounded-2 fw-medium">{user.id || user._id || "N/A"}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="small text-muted text-uppercase fw-bold mb-1">Role</label>
                                    <div className="p-3 bg-light rounded-2 fw-medium text-capitalize">{user.role || "User"}</div>
                                </div>
                            </div>
                            <button 
                                className="btn btn-dark mt-4 text-uppercase fw-bold px-4 py-2" 
                                style={{letterSpacing: '1px'}}
                                onClick={() => toast("Edit Profile coming soon!")}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                );
            case "orders":
                return (
                    <div className="d-flex flex-column gap-3">
                         <div className="card border-0 shadow-sm rounded-0 p-4 text-center bg-light">
                             <div className="py-5">
                                 <i className="fa fa-shopping-bag fa-3x text-muted mb-3 opacity-50"></i>
                                 <h5 className="fw-bold">No recent orders</h5>
                                 <p className="text-muted">Start shopping to fill your closet with luxury.</p>
                                 <Link to="/product" className="btn btn-dark text-uppercase fw-bold px-4 py-2 mt-2" style={{letterSpacing: '1px'}}>Shop Now</Link>
                             </div>
                         </div>
                    </div>
                );
            case "addresses":
                return (
                    <div className="card border-0 shadow-sm rounded-0">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold text-uppercase tracking-wide">Saved Addresses</h5>
                            <button className="btn btn-sm btn-outline-dark text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>+ Add New</button>
                        </div>
                        <div className="card-body p-4">
                            <div className="border rounded-2 p-3 position-relative bg-light">
                                <span className="badge bg-dark text-white position-absolute top-0 start-0 m-3 text-uppercase" style={{fontSize: '0.6rem', letterSpacing: '1px'}}>Default</span>
                                <h6 className="fw-bold mt-4">{user.name}</h6>
                                <p className="mb-1 text-muted small">123 Fashion Street, Luxury Avenue</p>
                                <p className="mb-1 text-muted small">Mumbai, Maharashtra - 400001</p>
                                <p className="mb-0 text-muted small">Phone: +91 98765 43210</p>
                                <div className="mt-3 d-flex gap-2">
                                    <button className="btn btn-sm btn-link text-decoration-none text-dark fw-bold px-0">Edit</button>
                                    <span className="text-muted">|</span>
                                    <button className="btn btn-sm btn-link text-decoration-none text-danger fw-bold px-0">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "wishlist":
                return (
                    <div className="card border-0 shadow-sm rounded-0">
                        <div className="card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold text-uppercase tracking-wide">My Wishlist ({wishlist.length})</h5>
                        </div>
                         <div className="card-body p-0">
                            {wishlist.length === 0 ? (
                                <div className="p-5 text-center">
                                    <i className="fa fa-heart-o fa-3x text-muted mb-3 opacity-50"></i>
                                    <h5 className="fw-bold">Your wishlist is empty</h5>
                                    <Link to="/product" className="btn btn-dark text-uppercase fw-bold px-4 py-2 mt-3" style={{letterSpacing: '1px'}}>Explore Products</Link>
                                </div>
                            ) : (
                                wishlist.map((item) => (
                                    <div key={item.id} className="d-flex align-items-center p-3 border-bottom hover-bg-light transition-all">
                                        <div className="bg-white border p-2 rounded" style={{width: 80, height: 80, marginRight: 20}}>
                                            <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-contain" />
                                        </div>
                                        <div className="flex-grow-1 pe-3">
                                            <h6 className="fw-bold mb-1 text-truncate" style={{maxWidth: '300px'}}>{item.title}</h6>
                                            <p className="text-muted small mb-0"><i className="fa fa-inr"></i> {item.price}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-dark btn-sm text-uppercase fw-bold text-nowrap"
                                                onClick={() => addToCart(item)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeFromWishlist(item)}
                                                title="Remove"
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                         </div>
                    </div>
                );
            case "custom":
                return (
                    <div className="card border-0 shadow-sm rounded-0">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold text-uppercase tracking-wide">My Custom Designs</h5>
                            <Link to="/custom" className="btn btn-sm btn-dark text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>+ Create New</Link>
                        </div>
                        <div className="card-body p-0">
                            {loadingCustom ? (
                                <div className="p-5 text-center">
                                    <div className="spinner-border text-dark" role="status"></div>
                                </div>
                            ) : customOrders.length === 0 ? (
                                <div className="p-5 text-center">
                                    <i className="fa fa-pencil-square-o fa-3x text-muted mb-3 opacity-50"></i>
                                    <h5 className="fw-bold">No custom designs yet</h5>
                                    <p className="text-muted">Personalize your style with our custom studio.</p>
                                    <Link to="/custom" className="btn btn-dark text-uppercase fw-bold px-4 py-2 mt-3" style={{letterSpacing: '1px'}}>Open Studio</Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 px-3 small text-uppercase">Type</th>
                                                <th className="border-0 small text-uppercase">Style</th>
                                                <th className="border-0 small text-uppercase">Status</th>
                                                <th className="border-0 small text-uppercase">Price</th>
                                                <th className="border-0 text-end px-3 small text-uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="px-3">
                                                        <div className="fw-bold text-capitalize">{order.productType}</div>
                                                        <small className="text-muted">#{order.id}</small>
                                                    </td>
                                                    <td>
                                                        <span className="small text-muted text-capitalize">{order.designPattern.replace('_', ' ')}</span>
                                                        <div className="d-flex gap-1 mt-1">
                                                            <div className="rounded-circle border" style={{width: 12, height: 12, backgroundColor: order.mainColor}}></div>
                                                            <div className="rounded-circle border" style={{width: 12, height: 12, backgroundColor: order.accentColor}}></div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${order.status === 'Pending' ? 'bg-info bg-opacity-10 text-info' : 'bg-success bg-opacity-10 text-success'}`} style={{fontSize: '0.65rem'}}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="fw-medium">₹{order.totalPrice}</td>
                                                    <td className="text-end px-3">
                                                        <button className="btn btn-sm btn-light border" onClick={() => toast(`Measurements: ${order.measurements}`)}>
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-light py-5" style={{minHeight: '80vh'}}>
                <div className="container">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-lg-3 mb-4">
                            <div className="card border-0 shadow-sm rounded-0">
                                <div className="card-body text-center py-4 border-bottom">
                                    <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <h5 className="fw-bold text-uppercase mb-0">{user.name || 'User'}</h5>
                                    <p className="text-muted small mb-0">Member</p>
                                </div>
                                <div className="list-group list-group-flush rounded-0">
                                    <button 
                                        onClick={() => setActiveTab("profile")}
                                        className={`list-group-item list-group-item-action py-3 fw-bold text-uppercase small ${activeTab === 'profile' ? 'bg-black text-white' : 'text-dark'}`}
                                        style={{letterSpacing: '1px'}}
                                    >
                                        <i className="fa fa-user me-3"></i> Profile Info
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("orders")}
                                        className={`list-group-item list-group-item-action py-3 fw-bold text-uppercase small ${activeTab === 'orders' ? 'bg-black text-white' : 'text-dark'}`}
                                        style={{letterSpacing: '1px'}}
                                    >
                                        <i className="fa fa-shopping-bag me-3"></i> My Orders
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("addresses")}
                                        className={`list-group-item list-group-item-action py-3 fw-bold text-uppercase small ${activeTab === 'addresses' ? 'bg-black text-white' : 'text-dark'}`}
                                        style={{letterSpacing: '1px'}}
                                    >
                                        <i className="fa fa-map-marker me-3"></i> Saved Addresses
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("wishlist")}
                                        className={`list-group-item list-group-item-action py-3 fw-bold text-uppercase small ${activeTab === 'wishlist' ? 'bg-black text-white' : 'text-dark'}`}
                                        style={{letterSpacing: '1px'}}
                                    >
                                        <i className="fa fa-heart me-3"></i> My Wishlist
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("custom")}
                                        className={`list-group-item list-group-item-action py-3 fw-bold text-uppercase small ${activeTab === 'custom' ? 'bg-black text-white' : 'text-dark'}`}
                                        style={{letterSpacing: '1px'}}
                                    >
                                        <i className="fa fa-pencil-square-o me-3"></i> Custom Designs
                                    </button>
                                     <button 
                                        onClick={handleLogout}
                                        className="list-group-item list-group-item-action py-3 fw-bold text-uppercase small text-danger"
                                        style={{letterSpacing: '1px'}}
                                    >
                                        <i className="fa fa-sign-out me-3"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="col-lg-9">
                           {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;
