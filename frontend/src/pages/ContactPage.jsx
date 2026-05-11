import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            toast.success("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } else {
            toast.error("Failed to send message");
        }
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="text-center mb-5">
            <h1 className="fw-bold display-4">Get in Touch</h1>
            <p className="lead text-muted">We'd love to hear from you. Here is how you can reach us.</p>
            <hr className="w-25 mx-auto text-dark" />
        </div>
        
        <div className="row g-5">
          {/* Contact Form */}
          <div className="col-md-7">
            <div className="p-4 border shadow-sm rounded-4 bg-white h-100">
                <h3 className="fw-bold mb-4">Send us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light border-0"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg bg-light border-0"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase">Message</label>
                    <textarea
                      rows={5}
                      className="form-control form-control-lg bg-light border-0"
                      placeholder="How can we help you?"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button
                    className="btn btn-dark btn-lg w-100 rounded-pill fw-bold"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
            </div>
          </div>

          {/* Contact Details & Map */}
          <div className="col-md-5">
             <div className="h-100 d-flex flex-column gap-4">
                 <div className="p-4 border shadow-sm rounded-4 bg-dark text-white">
                    <h4 className="fw-bold mb-3 text-warning">Contact Information</h4>
                    <p className="mb-2"><i className="fa fa-map-marker me-2 text-warning"></i> Jani Khurd, Meerut, UP, India</p>
                    <p className="mb-2"><i className="fa fa-envelope me-2 text-warning"></i> gautamsingh5100@gmail.com</p>
                    <p className="mb-0"><i className="fa fa-phone me-2 text-warning"></i> +91 94120 59826</p>
                 </div>
                 
                 <div className="border shadow-sm rounded-4 overflow-hidden flex-grow-1" style={{minHeight: '300px'}}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111498.05609594246!2d77.6162125642938!3d29.02066874929835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c7bfa197c36d3%3A0xc3f1464da477c7!2sJani%20Khurd%2C%20Uttar%20Pradesh%20250501!5e0!3m2!1sen!2sin!4v1705678901234!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps"
                    ></iframe>
                 </div>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
