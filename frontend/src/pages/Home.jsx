import React, { useEffect, useState } from "react";
import { Navbar, Footer } from "../components";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../assets/css/styles.css";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteItem } from "../redux/slices/cartSlice";

// Hero Section Component
const HeroSection = () => {
  const fallbackSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
      title: "Winter Collection 2024",
      subtitle: "Premium Jackets & Coats",
      text: "Stay warm in style with our latest range of thermal-insulated jackets.",
      buttonText: "Shop Now",
      buttonLink: "/product"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
      title: "Urban Streetwear",
      subtitle: "Trendy Tracksuits",
      text: "Experience ultimate comfort with our cotton-blend oversized tracksuits.",
      buttonText: "Shop Sale",
      buttonLink: "/product"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: "Activewear Essentials",
      subtitle: "High-Performance Lowers",
      text: "Stretchable, breathable, and durable lowers for your daily workout.",
      buttonText: "Explore",
      buttonLink: "/product"
    }
  ];

  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hero-slides");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
             setSlides(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch hero slides", error);
      }
    };
    fetchSlides();
  }, []);

  return (
    <div className="hero-section position-relative" style={{ height: '380px', overflow: 'hidden' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        effect="fade"
        loop={true}
        className="h-100"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="position-relative w-100 h-100">
              {/* Image */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-100 h-100" 
                style={{ objectFit: 'cover', objectPosition: 'center' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              
              {/* Content with minimal gradient for text readability */}
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
                   style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' }}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-9 col-lg-7 text-white ps-md-5">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                          <span className="badge bg-warning text-dark mb-3 px-3 py-2 text-uppercase fw-bold tracking-wide" style={{ letterSpacing: '2px', fontSize: '0.7rem' }}>
                            {slide.subtitle || 'New Arrival'}
                          </span>
                          <h1 className="display-5 fw-bold mb-3 text-uppercase" style={{ letterSpacing: '-1px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                            {slide.title}
                          </h1>
                          <p className="mb-4 lead opacity-90 fw-light" style={{ maxWidth: '450px', lineHeight: '1.6' }}>
                            {slide.text}
                          </p>
                          <Link to={slide.buttonLink || '/product'} className="btn btn-light rounded-1 px-5 py-3 fw-bold text-uppercase shadow-lg hover-scale">
                            {slide.buttonText || 'Shop Now'} <i className="fa fa-long-arrow-right ms-2"></i>
                          </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Fade Gradient used to be here, adding a subtle inner shadow vignette if desired */}
              <div className="position-absolute w-100 h-100 top-0 start-0 pointer-events-none" 
                   style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style>{`
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
};

// Featured Categories
const CategoriesSection = () => {
    const fallbackCategories = [
        { name: "Mens Jackets", image: "https://images.unsplash.com/photo-1551028919-ac66e6a46121?q=80&w=1000&auto=format&fit=crop", count: "New Arrivals", slug: "mens-jackets" },
        { name: "Tracksuits", image: "https://images.unsplash.com/photo-1620249429452-921c3858eb5b?q=80&w=1000&auto=format&fit=crop", count: "Best Selling", slug: "tracksuits" },
        { name: "Casual Lowers", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop", count: "Trending", slug: "casual-lowers" }
    ];

    const [categories, setCategories] = useState(fallbackCategories);

    useEffect(() => {
        const fetchCategories = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            try {
                const response = await fetch(`${apiUrl}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const mappedData = data.map(cat => ({
                            name: cat.name,
                            image: cat.image || 'https://placehold.co/600x400?text=No+Image',
                            count: cat.description || "Collection",
                            slug: cat.slug || cat.name,
                            link: `/product`
                        }));
                        setCategories(mappedData);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch categories from Category Master", error);
            }
            // Fallback remains if fetch fails
        };
        fetchCategories();
    }, []);

    return (
        <div className="py-5 bg-light">
            <div className="container py-4">
                <div className="row g-4 justify-content-center">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="col-md-4">
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="card border-0 shadow-sm rounded-4 overflow-hidden text-white h-100"
                            >
                                <div className="position-relative" style={{height: '350px'}}>
                                    <img 
                                        src={cat.image} 
                                        className="w-100 h-100 object-fit-cover" 
                                        alt={cat.name}
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                                    />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-black-50" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'}}>
                                        <h3 className="fw-bold mb-1">{cat.name}</h3>
                                        <p className="mb-0 text-white-50 small text-uppercase">{cat.count}</p>
                                    </div>
                                    <Link 
                                        to={cat.link || "/product"} 
                                        state={cat.slug ? { category: cat.slug } : null}
                                        className="stretched-link"
                                    >
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Trending Products Section
const TrendingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [categories, setCategories] = useState([]); // {name, slug}
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        // Fetch categories from Category Master for filters
        const fetchCategoryMaster = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            try {
                const res = await fetch(`${apiUrl}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setCategories(data.map(c => ({ name: c.name, slug: c.slug })));
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch category master", err);
            }
            // Fallback: derive categories from products if Category Master not available
            const derived = [...new Set(products.map(p => p.category).filter(Boolean))];
            setCategories(derived.map(slug => ({ name: slug, slug })));
        };
        fetchCategoryMaster();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    const addProduct = (product) => {
        dispatch(addItem(product));
        toast.success("Added to Cart");
    };

    // Filter products based on active tab
    const filteredProducts = activeFilter === "all"
        ? products
        : products.filter(item => item.category === activeFilter);
        
    // Limit to 8 items max for home page display
    const displayProducts = filteredProducts.slice(0, 8);

    // Product Card Component (Same as Products Page)
    const ProductCard = ({ product }) => {
        const cart = useSelector((state) => state.cart);
        const cartItem = cart.find((x) => x.id === product.id);

        return (
            <div className="col-md-3 col-sm-6 mb-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="card h-100 border-0 shadow-sm product-card group overflow-hidden rounded-4"
                >
                    {/* Image Container */}
                    <div className="position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center p-4" style={{ height: "260px" }}>
                        <Link to={"/product/" + product.id} className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="img-fluid object-fit-contain"
                            style={{maxHeight: '100%', maxWidth: '100%'}}
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                            onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
                            />
                        </Link>
                        
                        {/* Badges */}
                        <div className="position-absolute top-0 start-0 p-3 pt-2 d-flex flex-column gap-2">
                                {/* Mock Logic for Badges */}
                                {(product.ratingRate >= 4.5 || product.rating?.rate >= 4.5) && <span className="badge bg-warning text-dark shadow-sm">Bestseller</span>}
                                {product.price < 50 && <span className="badge bg-danger shadow-sm">Sale</span>}
                        </div>
    
                        {/* Quick Actions (Hover) */}
                        <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-2 product-actions opacity-0 translate-y-10 group-hover-visible transition-all">
                            <button 
                                className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                                style={{width: 40, height: 40}}
                                onClick={() => addProduct(product)}
                                title="Add to Cart"
                            >
                                <i className="fa fa-shopping-cart"></i>
                            </button>
                            <Link 
                                to={"/product/" + product.id}
                                className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                                style={{width: 40, height: 40}}
                                title="View Details"
                            >
                                <i className="fa fa-eye"></i>
                            </Link>
                        </div>
                    </div>
    
                    <div className="card-body p-4 d-flex flex-column bg-white">
                    <div className="mb-2">
                        <span className="text-muted small text-uppercase fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>{product.category}</span>
                    </div>
                    <Link to={"/product/" + product.id} className="text-decoration-none text-dark">
                        <h5 className="card-title text-truncate fw-bold mb-2" style={{fontSize: '1rem'}} title={product.title}>
                            {product.title}
                        </h5>
                    </Link>
                    
                    <div className="d-flex align-items-center mb-3">
                        <div className="d-flex text-warning small me-2">
                            <i className="fa fa-star"></i>
                            <span className="fw-bold ms-1 text-dark">{product.ratingRate || product.rating?.rate || 0}</span>
                        </div>
                        <small className="text-muted">({product.ratingCount || product.rating?.count || 0} reviews)</small>
                    </div>
    
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                        <h5 className="mb-0 fw-bold text-dark">₹{product.price}</h5>
                        
                        {cartItem ? (
                            <div className="d-flex align-items-center bg-dark rounded-pill p-1 shadow">
                                <button 
                                    className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" 
                                    style={{width: '28px', height: '28px', border: '1px solid rgba(255,255,255,0.2)'}}
                                    onClick={() => dispatch(deleteItem(product))}
                                >
                                    <i className="fa fa-minus font-xs text-white"></i>
                                </button>
                                <span className="mx-2 fw-bold text-white" style={{fontSize: '0.9rem', minWidth: '15px', textAlign: 'center'}}>{cartItem.qty}</span>
                                <button 
                                    className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" 
                                    style={{width: '28px', height: '28px', border: '1px solid rgba(255,255,255,0.2)'}}
                                    onClick={() => dispatch(addItem(product))}
                                >
                                    <i className="fa fa-plus font-xs text-white"></i>
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="btn btn-dark btn-sm rounded-pill px-3 py-2 fw-bold shadow-sm d-flex align-items-center gap-1"
                                onClick={() => addProduct(product)}
                            >
                                ADD <i className="fa fa-plus" style={{fontSize: '0.7rem'}}></i>
                            </button>
                        )}
                    </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="py-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <span className="text-warning text-uppercase fw-bold tracking-widest small">Discover</span>
                    <h2 className="display-6 fw-bold mt-2">Trending Products</h2>
                    <div className="mx-auto mt-3 bg-warning" style={{width: '60px', height: '4px', borderRadius: '2px'}}></div>
                </div>
                
                {/* Category Filter Tabs */}
                {/* Scrollable container for mobile */}
                <div className="d-flex justify-content-center mb-5 overflow-auto custom-scrollbar pb-2">
                    <div className="d-inline-flex gap-2 px-3">
                        {categories.map((cat, index) => (
                            <button
                                key={cat.slug || index}
                                onClick={() => setActiveFilter(cat.slug)}
                                className={`btn rounded-pill px-4 fw-bold text-nowrap transition-all ${activeFilter === (cat.slug || '') ? 'btn-dark shadow' : 'btn-outline-light text-dark border-0 hover-bg-light'}`}
                                style={{fontSize: '0.9rem'}}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    {loading ? [1,2,3,4].map(n => (
                        <div className="col-md-3" key={n}>
                            <Skeleton height={400} />
                        </div>
                    )) : displayProducts.length > 0 ? (
                        displayProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">No products found in this category.</p>
                        </div>
                    )}
                </div>
                
                <div className="text-center mt-5">
                    <Link to="/product" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold">View All Products</Link>
                </div>
            </div>
            
            <style>{`
                .hover-bg-light:hover { background-color: #f8f9fa; }
                /* Hide scrollbar for clean look but allow scroll */
                .custom-scrollbar::-webkit-scrollbar { height: 0px; background: transparent; }
            `}</style>
        </div>
    );
};



// Newsletter
const NewsletterSection = () => (
    <div className="py-5 bg-light">
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <h2 className="fw-bold mb-3">Join Our Newsletter</h2>
                    <p className="text-muted mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                    <div className="input-group mb-3 shadow-sm rounded-pill overflow-hidden bg-white p-1">
                        <input type="email" className="form-control border-0 ps-4 shadow-none" placeholder="Enter your email" />
                        <button className="btn btn-dark rounded-pill px-5 fw-bold" type="button">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <TrendingSection />
      <NewsletterSection />
      <Footer />
      <style>{`
        .group:hover .group-hover-visible {
            opacity: 1 !important;
            transform: translateY(-10px) !important;
        }
        .last-no-border:last-child {
            border-right: 0 !important;
        }
        @media (max-width: 768px) {
            .last-no-border { border-right: 0 !important; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2rem; }
            .last-no-border:last-child { border-bottom: 0; padding-bottom: 0; }
        }
      `}</style>
    </>
  );
};

export default Home;