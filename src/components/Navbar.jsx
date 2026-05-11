import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../assets/css/navbar.css";

const Navbar = () => {
    const state = useSelector((state) => state.cart);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all"); 
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // Check for token on mount to set initial login state
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const navLinks = [
        { path: "/", label: t("navbar.home") },
        { path: "/product", label: t("navbar.products") },
        { path: "/gift", label: t("navbar.gifts") },
        { path: "/orders", label: t("navbar.orders") },
        { path: "/ai-info", label: t("navbar.ask_ai") },
        { path: "/cart-custom", label: t("navbar.custom_orders") },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/product', { state: { searchQuery: search, category: category !== 'all' ? category : null } });
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const getCurrentLangFlag = () => {
        const lang = i18n.language || 'en';
        if (lang.startsWith('hi')) return '🇮🇳 HI';
        if (lang.startsWith('pa')) return '🇮🇳 PA';
        return '🇺🇸 EN'; // Default
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            
            {/* Top Utility Bar - Ultra Slim & Boxed */}
            <div style={{backgroundColor: '#000000', borderBottom: '1px solid #222'}}>
                <div className="container py-1 d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center text-white small gap-2">
                    {/* Left: Shipping Info & Code */}
                    <div className="d-flex align-items-center text-uppercase" style={{fontSize: '9px', letterSpacing: '1px'}}>
                        <span className="fw-bold"><i className="fa fa-truck me-1 text-warning"></i>Free Ship &gt; ₹999</span>
                        <span className="mx-2 opacity-50">|</span>
                        <span className="fw-bold">Code: <span className="text-warning">ROYALTY</span></span>
                    </div>

                    {/* Right: Utilities */}
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        {/* Buttons Group */}
                        <div className="d-flex gap-1 gap-md-2 justify-content-center flex-grow-1 flex-lg-grow-0">
                            <Link to="/ai-info" className="btn btn-sm border border-secondary rounded-0 text-white px-2 py-0 d-flex align-items-center gap-1 text-uppercase fw-bold hover-bg-white hover-text-black transition-all" style={{fontSize: '9px', letterSpacing: '0.5px', height: '24px'}}>
                                <i className="fa fa-magic text-warning"></i> Ask AI
                            </Link>
                            <Link to="/cart-custom" className="btn btn-sm border border-secondary rounded-0 text-white px-2 py-0 d-flex align-items-center gap-1 text-uppercase fw-bold hover-bg-white hover-text-black transition-all" style={{fontSize: '9px', letterSpacing: '0.5px', height: '24px'}}>
                                <i className="fa fa-pencil text-warning"></i> Custom
                            </Link>
                            <Link to="/orders" className="btn btn-sm border border-secondary rounded-0 text-white px-2 py-0 d-flex align-items-center gap-1 text-uppercase fw-bold hover-bg-white hover-text-black transition-all" style={{fontSize: '9px', letterSpacing: '0.5px', height: '24px'}}>
                                <i className="fa fa-refresh text-warning"></i> Returns
                            </Link>
                        </div>
                        
                        {/* Language */}
                        <div className="dropdown position-relative ms-2">
                            <button className="btn btn-sm border border-secondary rounded-0 text-white px-2 py-0 dropdown-toggle d-flex align-items-center gap-1 text-uppercase fw-bold hover-bg-white hover-text-black transition-all" type="button" data-bs-toggle="dropdown" style={{fontSize: '9px', letterSpacing: '0.5px', height: '24px'}}>
                                 {getCurrentLangFlag()} {i18n.language.toUpperCase()}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-1 rounded-0" style={{minWidth: '100px', fontSize: '11px', zIndex: 2000}}>
                                <li><button className="dropdown-item py-1" onClick={() => changeLanguage('en')}>🇺🇸 EN</button></li>
                                <li><button className="dropdown-item py-1" onClick={() => changeLanguage('hi')}>🇮🇳 HI</button></li>
                                <li><button className="dropdown-item py-1" onClick={() => changeLanguage('pa')}>🇮🇳 PA</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation - Slim & Boxed */}
            <nav className="navbar navbar-expand-lg sticky-top py-2 shadow-sm bg-white" style={{borderBottom: '1px solid #f0f0f0'}}>
                <div className="container">
                    {/* Brand Logo - Centered alignment on mobile if needed, but keeping left for now */}
                    <Link className="navbar-brand d-flex flex-column align-items-center me-lg-5" to="/">
                        <span className="fw-bold fs-2 lh-1" style={{color: '#000', letterSpacing: '-1px'}}>PRINCE</span>
                        <span className="small text-uppercase fw-bold" style={{fontSize: '8px', letterSpacing:'4px', color: '#c5a027', marginTop: '2px'}}>GARMENTS</span>
                    </Link>

                    {/* Mobile Toggler */}
                    <button className="navbar-toggler border-0 p-1" type="button" onClick={() => setIsOpen(true)}>
                         <span className="fa fa-bars fs-3 text-dark"></span>
                    </button>

                    {/* Desktop Content */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* Navigation Links - Left Aligned to Logo */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-4">
                            <li className="nav-item">
                                <NavLink className="nav-link text-dark px-0 fw-bold text-uppercase tracking-wide" to="/" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>{t('navbar.home')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link text-dark px-0 fw-bold text-uppercase tracking-wide" to="/product" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>{t('navbar.products')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link text-dark px-0 fw-bold text-uppercase tracking-wide" to="/blog" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Blog</NavLink>
                            </li>
                             <li className="nav-item">
                                <NavLink className="nav-link text-dark px-0 fw-bold text-uppercase tracking-wide" to="/about" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>{t('navbar.about')}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link text-dark px-0 fw-bold text-uppercase tracking-wide" to="/contact" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>{t('navbar.contact')}</NavLink>
                            </li>
                        </ul>

                        {/* Search & Icons - Right Aligned */}
                        <div className="d-flex align-items-center gap-4">
                            {/* Minimal Search Bar with Category */}
                            <form onSubmit={handleSearch} className="d-none d-lg-flex align-items-center border" style={{backgroundColor: '#fff', borderRadius: '30px', padding: '2px 5px', width: '380px', borderColor: '#e0e0e0'}}>
                                <select 
                                    className="form-select border-0 bg-transparent text-muted shadow-none py-0 ps-3 pe-4" 
                                    style={{fontSize: '0.8rem', width: 'auto', borderRadius: '30px 0 0 30px', cursor: 'pointer', fontWeight: '500', appearance: 'none', backgroundImage: 'none'}}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="all">All Category</option>
                                    <option value="men's clothing">Men</option>
                                    <option value="women's clothing">Women</option>
                                    <option value="jewelery">Jewelry</option>
                                    <option value="electronics">Electronics</option>
                                </select>
                                <div style={{width: '1px', height: '24px', backgroundColor: '#e0e0e0', margin: '0 10px'}}></div>
                                <input 
                                    className="form-control border-0 bg-transparent shadow-none p-0 text-dark" 
                                    type="search" 
                                    placeholder="Search..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{fontSize: '0.8rem'}}
                                />
                                <button className="btn border-0 p-2 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" type="submit" style={{width: '32px', height: '32px', minWidth: '32px'}}>
                                    <i className="fa fa-search" style={{fontSize: '0.8rem'}}></i>
                                </button>
                            </form>

                            {/* Icons: User & Cart */}
                            <div className="d-flex align-items-center gap-3">
                                {isLoggedIn ? (
                                    <Link to="/profile" className="btn btn-link text-dark p-0 hover-opacity">
                                        <i className="fa fa-user-o fs-5"></i>
                                    </Link>
                                ) : (
                                    <Link to="/login" className="btn btn-link text-dark p-0 hover-opacity border-0 bg-transparent">
                                        <i className="fa fa-user-o fs-5"></i>
                                    </Link>
                                )}
                                
                                <Link to="/cart" className="btn btn-link text-dark p-0 text-decoration-none position-relative">
                                    <i className="fa fa-shopping-bag fs-5"></i>
                                    {state.length > 0 && (
                                        <span className="position-absolute bottom-0 start-100 translate-middle badge rounded-circle bg-dark text-white border border-white d-flex align-items-center justify-content-center" style={{width: '16px', height: '16px', fontSize: '0.6rem'}}>
                                            {state.length}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />

            {/* Mobile Drawer (Sidebar) - Minimal White */}
            <div className={`mobile-drawer ${isOpen ? 'open' : ''}`} style={{backgroundColor: '#fff', borderRight: '1px solid #eee'}}>
                <button className="close-btn text-dark" onClick={() => setIsOpen(false)} style={{top: '20px', right: '20px', fontSize: '2rem', lineHeight: '1'}}>&times;</button>
                
                <div className="mb-5 mt-2 ps-2">
                    <span className="fw-bold fs-2 d-block" style={{fontFamily: 'Playfair Display, serif', color: '#000'}}>PRINCE</span>
                    <span className="text-uppercase fw-bold text-warning" style={{fontSize: '10px', letterSpacing:'3px'}}>GARMENTS</span>
                </div>
                
                <form onSubmit={handleSearch} className="d-flex mb-4 p-2 border-bottom">
                     <input className="form-control border-0 bg-transparent text-dark shadow-none ps-0" type="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                     <button className="btn text-dark" type="submit"><i className="fa fa-search"></i></button>
                </form>

                <div className="d-flex flex-column gap-3">
                    <NavLink className="text-dark text-uppercase fw-bold text-decoration-none" to="/" onClick={() => setIsOpen(false)} style={{fontSize: '0.9rem', letterSpacing: '1px'}}>{t('navbar.home')}</NavLink>
                    <NavLink className="text-dark text-uppercase fw-bold text-decoration-none" to="/product" onClick={() => setIsOpen(false)} style={{fontSize: '0.9rem', letterSpacing: '1px'}}>{t('navbar.products')}</NavLink>
                    <NavLink className="text-dark text-uppercase fw-bold text-decoration-none" to="/orders" onClick={() => setIsOpen(false)} style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Returns</NavLink>
                    <NavLink className="text-dark text-uppercase fw-bold text-decoration-none" to="/cart-custom" onClick={() => setIsOpen(false)} style={{fontSize: '0.9rem', letterSpacing: '1px'}}>{t('navbar.custom_orders')}</NavLink>
                    <NavLink className="text-dark text-uppercase fw-bold text-decoration-none" to="/about" onClick={() => setIsOpen(false)} style={{fontSize: '0.9rem', letterSpacing: '1px'}}>{t('navbar.about')}</NavLink>
                    <NavLink className="text-dark text-uppercase fw-bold text-decoration-none" to="/contact" onClick={() => setIsOpen(false)} style={{fontSize: '0.9rem', letterSpacing: '1px'}}>{t('navbar.contact')}</NavLink>
                </div>

                <div className="mt-auto pt-5 border-top border-light-subtle">
                     {isLoggedIn ? (
                        <NavLink to="/profile" className="btn btn-dark w-100 mb-3 py-3 text-uppercase fw-bold" onClick={() => setIsOpen(false)} style={{letterSpacing: '1px'}}>
                             My Profile
                        </NavLink>
                     ) : (
                        <NavLink to="/login" className="btn btn-dark w-100 mb-3 py-3 text-uppercase fw-bold" onClick={() => setIsOpen(false)} style={{letterSpacing: '1px'}}>
                             {t('navbar.sign_in')}
                        </NavLink>
                     )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
