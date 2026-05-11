import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginRegisterModal = ({ show, handleClose, isLogin, setIsLogin, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleAuth = async () => {
        if (!isLogin) {
            // Registration
            try {
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name: "Customer" })
                });
                
                if (response.ok) {
                    toast.success("Registration successful! Please login.");
                    setIsLogin(true);
                } else {
                    toast.error("Registration failed");
                }
            } catch (error) {
                toast.error("Registration error");
            }
            return;
        }
        
        // Login
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                const { user, token } = data;
                
                // If admin role, redirect to admin panel
                if (user.role !== 'customer') {
                    toast.error("Admin users must login at /admin");
                    handleClose();
                    navigate('/admin/login');
                    return;
                }
                
                // Store token in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                toast.success(`Welcome ${user.name}!`);
                onLogin();
                handleClose();
                navigate("/profile");
            } else {
                toast.error("Invalid credentials");
            }
        } catch (error) {
            toast.error("Login failed");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" contentClassName="border-0 rounded-4 overflow-hidden shadow-lg">
            <div className="row g-0">
                {/* Left Side (Image/Brand) - Hidden on mobile */}
                <div className="col-md-5 d-none d-md-flex bg-dark text-white flex-column justify-content-center align-items-center p-4 text-center">
                    <h2 className="fw-bold mb-3">Prince Garments</h2>
                    <p className="lead small text-white-50">Join our community and experience the best in fashion.</p>
                    <div className="mt-4">
                        <i className="fa fa-shopping-bag fa-3x text-warning mb-3"></i>
                        <h4 className="fw-bold text-warning">Premium Style</h4>
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="col-md-7 bg-white p-4 p-md-5">
                    <div className="text-end">
                        <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                    </div>
                    
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">{isLogin ? "Welcome Back" : "Create Account"}</h3>
                        <p className="text-muted small">
                            {isLogin ? "Please login to your account" : "Sign up to get started"}
                        </p>
                    </div>

                    <form>
                        {!isLogin && (
                             <div className="form-floating mb-3">
                                 <input type="text" className="form-control rounded-3" id="floatingName" placeholder="Full Name" />
                                 <label htmlFor="floatingName">Full Name</label>
                            </div>
                        )}

                        <div className="form-floating mb-3">
                            <input 
                                type="email" 
                                className="form-control rounded-3" 
                                id="floatingInput" 
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input 
                                type="password" 
                                className="form-control rounded-3" 
                                id="floatingPassword" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        <button className="btn btn-dark w-100 py-2 rounded-pill fw-bold btn-lg mb-3" type="button" onClick={handleAuth}>
                            {isLogin ? "Login" : "Register"}
                        </button>
                        
                        <div className="text-center mb-3">
                             <span className="text-muted small">Or continue with</span>
                        </div>

                        <div className="d-flex justify-content-center gap-2 mb-4">
                             <button className="btn btn-outline-secondary rounded-circle" type="button"><i className="fab fa-google"></i></button>
                             <button className="btn btn-outline-secondary rounded-circle" type="button"><i className="fab fa-facebook-f"></i></button>
                             <button className="btn btn-outline-secondary rounded-circle" type="button"><i className="fab fa-apple"></i></button>
                        </div>

                        <div className="text-center">
                            <p className="mb-0 text-muted small">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <span 
                                    className="fw-bold text-dark text-decoration-underline" 
                                    style={{cursor: 'pointer'}}
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin ? "Register" : "Login"}
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default LoginRegisterModal;
