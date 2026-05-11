import React from 'react'
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";

const GiftPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
            <h1 className="fw-bold display-4 text-warning">Gift Cards & Gifting</h1>
            <p className="lead text-muted">The perfect gift for everyone, every time.</p>
        </div>

        {/* Gift Card Options */}
        <div className="row g-4 mb-5">
            <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="bg-dark text-white p-5 text-center d-flex flex-column justify-content-center" style={{height: '250px'}}>
                        <h3 className="fw-bold mb-0">Prince Garments</h3>
                        <p className="mb-0">eGift Card</p>
                    </div>
                    <div className="card-body text-center">
                        <h5 className="fw-bold">eGift Cards</h5>
                        <p className="text-muted small">Instant delivery via email. Perfect for last-minute gifts.</p>
                        <button className="btn btn-warning rounded-pill px-4 fw-bold">Buy Now</button>
                    </div>
                </div>
            </div>
             <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="bg-warning text-dark p-5 text-center d-flex flex-column justify-content-center" style={{height: '250px'}}>
                        <h3 className="fw-bold mb-0 text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>Prince Garments</h3>
                        <p className="mb-0 fw-bold">Physical Card</p>
                    </div>
                    <div className="card-body text-center">
                        <h5 className="fw-bold">Physical Gift Cards</h5>
                        <p className="text-muted small">Beautifully packaged and delivered to their doorstep.</p>
                        <button className="btn btn-dark rounded-pill px-4 fw-bold">Buy Now</button>
                    </div>
                </div>
            </div>
             <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="bg-primary text-white p-5 text-center d-flex flex-column justify-content-center" style={{height: '250px', background: 'linear-gradient(45deg, #1e3c72, #2a5298)'}}>
                        <i className="fa fa-building fa-4x mb-3"></i>
                        <h4 className="fw-bold">Corporate</h4>
                    </div>
                    <div className="card-body text-center">
                        <h5 className="fw-bold">Corporate Gifting</h5>
                        <p className="text-muted small">Reward your employees and clients with the gift of style.</p>
                        <button className="btn btn-outline-dark rounded-pill px-4 fw-bold">Inquire Now</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Gift Wrap Service */}
        <div className="row align-items-center mb-5 bg-light rounded-4 p-4 p-md-5 mx-0">
             <div className="col-md-6 mb-4 mb-md-0">
                 <img src="https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Gift Wrapping" className="img-fluid rounded-4 shadow-sm" />
             </div>
             <div className="col-md-6 ps-md-5">
                 <h2 className="fw-bold mb-3">Premium Gift Wrapping</h2>
                 <p className="lead text-muted mb-4">
                     Make your gift extra special with our premium gift wrapping service. 
                     We use high-quality paper, ribbons, and personalized notes to ensure your gift looks as amazing on the outside as it is on the inside.
                 </p>
                 <ul className="list-unstyled mb-4">
                     <li className="mb-2"><i className="fa fa-check text-success me-2"></i> Only ₹99.00 per item</li>
                     <li className="mb-2"><i className="fa fa-check text-success me-2"></i> Personalized message card included</li>
                     <li className="mb-2"><i className="fa fa-check text-success me-2"></i> Eco-friendly materials</li>
                 </ul>
                 <Link to="/product" className="btn btn-dark btn-lg rounded-pill fw-bold px-5">Shop Gifts</Link>
             </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default GiftPage
