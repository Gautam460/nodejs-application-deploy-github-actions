import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/css/footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: "#232F3E", fontSize: "14px" }}>
      <div className="container">
        <div className="row">
          
          {/* Column 1: Get to Know Us */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3 text-white">Get to Know Us</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-white-50">
               <li><NavLink to="/about" className="text-decoration-none text-white-50 hover-text-white">About Us</NavLink></li>
               <li><NavLink to="/node" className="text-decoration-none text-white-50 hover-text-white">Careers</NavLink></li>
               <li><NavLink to="/node" className="text-decoration-none text-white-50 hover-text-white">Press Releases</NavLink></li>
               <li><NavLink to="/node" className="text-decoration-none text-white-50 hover-text-white">Prince Science</NavLink></li>
            </ul>
          </div>

          {/* Column 2: Shop With Us */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3 text-white">Shop With Us</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-white-50">
               <li><NavLink to="/product" className="text-decoration-none text-white-50 hover-text-white">Men's Fashion</NavLink></li>
               <li><NavLink to="/product" className="text-decoration-none text-white-50 hover-text-white">Women's Fashion</NavLink></li>
               <li><NavLink to="/product" className="text-decoration-none text-white-50 hover-text-white">Accessories</NavLink></li>
               <li><NavLink to="/gift" className="text-decoration-none text-white-50 hover-text-white">Gift Cards</NavLink></li>
            </ul>
          </div>

           {/* Column 3: Connect with Us */}
           <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3 text-white">Connect with Us</h6>
            <div className="d-flex gap-3">
               <a href="#" className="text-white-50 hover-text-white transition-all"><i className="fab fa-facebook fa-lg"></i></a>
               <a href="#" className="text-white-50 hover-text-white transition-all"><i className="fab fa-instagram fa-lg"></i></a>
               <a href="#" className="text-white-50 hover-text-white transition-all"><i className="fab fa-twitter fa-lg"></i></a>
               <a href="#" className="text-white-50 hover-text-white transition-all"><i className="fab fa-linkedin fa-lg"></i></a>
            </div>
          </div>

          {/* Column 4: Address (User Specific) */}
          <div className="col-md-3 mb-4">
             <h6 className="fw-bold mb-3 text-white">Contact Us</h6>
             <ul className="list-unstyled d-flex flex-column gap-2 text-white-50">
                <li className="d-flex gap-2"><i className="fa fa-map-marker mt-1"></i> <span>Jani Khurd, Meerut, UP</span></li>
                <li className="d-flex gap-2"><i className="fa fa-phone mt-1"></i> <span>+91 94120 59826</span></li>
                <li className="d-flex gap-2"><i className="fa fa-envelope mt-1"></i> <span>gautamsingh5100@gmail.com</span></li>
             </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* Bottom Strip */}
        <div className="text-center">
            <div className="d-flex justify-content-center gap-4 mb-2 small text-white-50">
                <span className="cursor-pointer hover-text-white">Conditions of Use</span>
                <span className="cursor-pointer hover-text-white">Privacy Notice</span>
                <span className="cursor-pointer hover-text-white">Interest-Based Ads</span>
            </div>
            <p className="small text-white-50 mb-0">&copy; 1996-{new Date().getFullYear()}, Prince Garments, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
