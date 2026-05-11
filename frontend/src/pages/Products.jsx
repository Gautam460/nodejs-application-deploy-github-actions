import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteItem } from "../redux/slices/cartSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Footer, Navbar } from "../components";
import { motion, AnimatePresence } from "framer-motion";

const FilterSidebar = ({ 
    data, 
    searchQuery, setSearchQuery,
    selectedCategories, toggleCategory,
    minPrice, maxPrice, setMinPrice, setMaxPrice,
    localMin, setLocalMin, localMax, setLocalMax,
    absoluteMaxPrice,
    onlyInStock, setOnlyInStock,
    selectedRating, setSelectedRating,
    resetFilters
}) => {
  const availableCategories = [...new Set(data.map(item => item.category))].filter(Boolean).sort();

  return (
    <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-uppercase tracking-wide"><i className="fa fa-sliders me-2"></i> Filters</h6>
            <button className="btn btn-link btn-sm text-decoration-none text-muted p-0 fw-bold" onClick={resetFilters} style={{fontSize: '0.7rem'}}>RESET</button>
        </div>
        <div className="card-body p-4 custom-scrollbar" style={{maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', overflowX: 'hidden'}}>
             {/* Search in Sidebar */}
             <div className="mb-4">
                 <div className="input-group input-group-sm bg-light rounded-3 p-1">
                     <span className="input-group-text bg-transparent border-0"><i className="fa fa-search text-muted"></i></span>
                     <input 
                       type="text" 
                       className="form-control bg-transparent border-0 shadow-none font-sm" 
                       placeholder="Search products..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                 </div>
             </div>

             {/* Categories */}
             <div className="mb-4">
                 <h6 className="fw-bold mb-3 small text-uppercase text-secondary">Categories</h6>
                 <div className="d-flex flex-column gap-2">
                      {availableCategories.map((cat, index) => (
                         <div key={index} className="form-check custom-checkbox">
                             <input 
                               className="form-check-input shadow-none cursor-pointer" 
                               type="checkbox" 
                               id={`cat-${index}`} 
                               checked={selectedCategories.includes(cat.toLowerCase())}
                               onChange={() => toggleCategory(cat)}
                             />
                             <label className="form-check-label small fw-semibold text-dark cursor-pointer text-capitalize" htmlFor={`cat-${index}`}>{cat}</label>
                         </div>
                      ))}
                 </div>
             </div>
             
             <hr className="text-muted opacity-10" />

             {/* Price Range - Simple & Working */}
             <div className="mb-4">
                 <h6 className="fw-bold mb-3 small text-uppercase text-secondary">Price Range</h6>
                 
                 {/* Current Selection Display */}
                 <div className="bg-light rounded p-2 mb-3 text-center">
                     <small className="text-muted d-block mb-1" style={{fontSize: '0.7rem'}}>Selected Range</small>
                     <div className="fw-bold text-dark">₹{minPrice} - ₹{maxPrice}</div>
                 </div>
                 
                 {/* Min Price Input */}
                 <div className="mb-3">
                     <label className="form-label small text-muted mb-1">Minimum Price</label>
                     <div className="input-group input-group-sm">
                         <span className="input-group-text bg-white">₹</span>
                         <input 
                           type="number" 
                           className="form-control shadow-none" 
                           value={localMin}
                           min={0}
                           max={localMax}
                           onChange={(e) => {
                             const val = parseInt(e.target.value) || 0;
                             setLocalMin(val);
                           }}
                           onBlur={() => {
                             const val = Math.max(0, Math.min(localMin, maxPrice - 50));
                             setLocalMin(val);
                             setMinPrice(val);
                           }}
                         />
                     </div>
                     <input 
                       type="range" 
                       className="form-range mt-2" 
                       min="0" 
                       max={absoluteMaxPrice} 
                       step="50"
                       value={localMin}
                       onChange={(e) => setLocalMin(parseInt(e.target.value))}
                       onMouseUp={() => {
                          const val = Math.min(localMin, maxPrice - 50);
                          setLocalMin(val);
                          setMinPrice(val);
                       }}
                       onTouchEnd={() => {
                          const val = Math.min(localMin, maxPrice - 50);
                          setLocalMin(val);
                          setMinPrice(val);
                       }}
                     />
                 </div>
                 
                 {/* Max Price Input */}
                 <div className="mb-2">
                     <label className="form-label small text-muted mb-1">Maximum Price</label>
                     <div className="input-group input-group-sm">
                         <span className="input-group-text bg-white">₹</span>
                         <input 
                           type="number" 
                           className="form-control shadow-none" 
                           value={localMax}
                           min={localMin}
                           max={absoluteMaxPrice}
                           onChange={(e) => {
                             const val = parseInt(e.target.value) || absoluteMaxPrice;
                             setLocalMax(val);
                           }}
                           onBlur={() => {
                             const val = Math.min(absoluteMaxPrice, Math.max(localMax, minPrice + 50));
                             setLocalMax(val);
                             setMaxPrice(val);
                           }}
                         />
                     </div>
                     <input 
                       type="range" 
                       className="form-range mt-2" 
                       min="0" 
                       max={absoluteMaxPrice} 
                       step="50"
                       value={localMax}
                       onChange={(e) => setLocalMax(parseInt(e.target.value))}
                       onMouseUp={() => {
                          const val = Math.max(localMax, minPrice + 50);
                          setLocalMax(val);
                          setMaxPrice(val);
                       }}
                       onTouchEnd={() => {
                          const val = Math.max(localMax, minPrice + 50);
                          setLocalMax(val);
                          setMaxPrice(val);
                       }}
                     />
                 </div>
                 
                 {/* Quick Price Buttons */}
                 <div className="d-flex flex-wrap gap-1 mt-3">
                     <button 
                       className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1" 
                       style={{fontSize: '0.7rem'}}
                       onClick={() => { setMinPrice(0); setMaxPrice(500); setLocalMin(0); setLocalMax(500); }}
                     >
                       Under ₹500
                     </button>
                     <button 
                       className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1" 
                       style={{fontSize: '0.7rem'}}
                       onClick={() => { setMinPrice(500); setMaxPrice(1000); setLocalMin(500); setLocalMax(1000); }}
                     >
                       ₹500-₹1000
                     </button>
                     <button 
                       className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1" 
                       style={{fontSize: '0.7rem'}}
                       onClick={() => { setMinPrice(1000); setMaxPrice(absoluteMaxPrice); setLocalMin(1000); setLocalMax(absoluteMaxPrice); }}
                     >
                       Above ₹1000
                     </button>
                 </div>
             </div>

             <hr className="text-muted opacity-10" />

             {/* Availability */}
             <div className="mb-4">
                 <h6 className="fw-bold mb-3 small text-uppercase text-secondary">Availability</h6>
                 <div className="form-check form-switch">
                     <input 
                       className="form-check-input shadow-none cursor-pointer" 
                       type="checkbox" 
                       id="stockSwitch"
                       checked={onlyInStock}
                       onChange={(e) => setOnlyInStock(e.target.checked)}
                     />
                     <label className="form-check-label small fw-semibold text-dark cursor-pointer" htmlFor="stockSwitch">In Stock Only</label>
                 </div>
             </div>

             <hr className="text-muted opacity-10" />

             {/* Ratings */}
             <div className="mb-0">
                 <h6 className="fw-bold mb-3 small text-uppercase text-secondary">Minimum Rating</h6>
                 <div className="d-flex flex-column gap-1">
                      {[4, 3, 2, 1].map(star => (
                          <div 
                            key={star} 
                            className={`d-flex align-items-center px-2 py-1 rounded cursor-pointer transition-all ${selectedRating === star ? 'bg-warning bg-opacity-10 border border-warning border-opacity-25' : 'hover-bg-light'}`}
                            onClick={() => setSelectedRating(star === selectedRating ? 0 : star)}
                          >
                              <div className="text-warning me-2" style={{fontSize: '0.75rem'}}>
                                  {[...Array(5)].map((_, i) => (
                                      <i key={i} className={`fa ${i < star ? 'fa-star' : 'fa-star-o'}`}></i>
                                  ))}
                              </div>
                              <small className="text-secondary fw-medium">& Up</small>
                          </div>
                      ))}
                 </div>
             </div>
        </div>
    </div>
  );
};

const ProductCard = ({ product, dispatch }) => {
  const cart = useSelector((state) => state.cart);
  const cartItem = cart.find((x) => x.id === product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="col-xl-4 col-md-6 col-sm-6 mb-4"
    >
      <div className="card h-100 border-0 shadow-sm product-card group overflow-hidden rounded-4">
        <div className="position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center p-4" style={{ height: "260px" }}>
            <Link to={"/product/" + product.id} className="w-100 h-100 d-flex align-items-center justify-content-center">
                <motion.img
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
                className="img-fluid object-fit-contain"
                style={{maxHeight: '100%', maxWidth: '100%'}}
                src={product.image}
                alt={product.title}
                loading="lazy"
                onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
                />
            </Link>
            
            <div className="position-absolute top-0 start-0 p-3 pt-2 d-flex flex-column gap-1">
                 {parseFloat(product.ratingRate) >= 4.5 && <span className="badge bg-warning text-dark shadow-sm font-xs px-2 py-1">BESTSELLER</span>}
                 {parseFloat(product.price) < 500 && <span className="badge bg-danger shadow-sm font-xs px-2 py-1">MEGA SALE</span>}
            </div>

            <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-2 product-actions opacity-0 translate-y-10 group-hover-visible transition-all">
                <button 
                    className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                    style={{width: 38, height: 38}}
                    onClick={() => { dispatch(addItem(product)); toast.success("Added to Cart"); }}
                >
                    <i className="fa fa-shopping-cart text-dark"></i>
                </button>
                <Link 
                    to={"/product/" + product.id}
                    className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                    style={{width: 38, height: 38}}
                >
                    <i className="fa fa-eye text-dark"></i>
                </Link>
            </div>
        </div>

        <div className="card-body p-4 d-flex flex-column bg-white">
          <div className="mb-1">
              <span className="text-secondary small text-uppercase fw-bold opacity-75" style={{fontSize: '0.65rem', letterSpacing: '1px'}}>{product.category}</span>
          </div>
          <Link to={"/product/" + product.id} className="text-decoration-none text-dark">
              <h5 className="card-title text-truncate fw-bold mb-2" style={{lineHeight: 1.4}} title={product.title}>
                {product.title}
              </h5>
          </Link>
          
          <div className="d-flex align-items-center mb-3">
             <div className="d-flex text-warning small me-2">
                 <i className="fa fa-star"></i>
                 <span className="fw-bold ms-1 text-dark">{product.ratingRate || product.rating?.rate || 0}</span>
             </div>
             <small className="text-muted" style={{fontSize: '0.75rem'}}>({product.ratingCount || product.rating?.count || 0})</small>
          </div>

          <div className="mt-auto d-flex align-items-center justify-content-between">
              <div>
                  <h5 className="mb-0 fw-bold text-dark">₹{product.price}</h5>
              </div>
              
              {cartItem ? (
                  <div className="d-flex align-items-center bg-dark rounded-pill p-1 shadow">
                      <button 
                        className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" 
                        style={{width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.2)'}}
                        onClick={() => dispatch(deleteItem(product))}
                      >
                          <i className="fa fa-minus font-xs text-white"></i>
                      </button>
                      <span className="mx-3 fw-bold text-white" style={{minWidth: '20px', textAlign: 'center'}}>{cartItem.qty}</span>
                      <button 
                        className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" 
                        style={{width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.2)'}}
                        onClick={() => dispatch(addItem(product))}
                      >
                          <i className="fa fa-plus font-xs text-white"></i>
                      </button>
                  </div>
              ) : (
                  <button 
                    className="btn btn-dark btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                    onClick={() => { dispatch(addItem(product)); toast.success("Added to Cart"); }}
                  >
                      ADD <i className="fa fa-plus" style={{fontSize: '0.7rem'}}></i>
                  </button>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [localMin, setLocalMin] = useState(0);
  const [localMax, setLocalMax] = useState(10000);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(10000); // Track the actual max price from products
  const [selectedRating, setSelectedRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { state } = useLocation();
  const dispatch = useDispatch();

   // Initial Fetch
   useEffect(() => {
     const getProducts = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products`);
        if (response.ok) {
          const products = await response.json();
          setData(products);
          setFilter(products);
          
          // Calculate and set the actual max price from products
          if (products.length > 0) {
            const prices = products.map(p => parseFloat(p.price));
            const calculatedMax = Math.ceil(Math.max(...prices));
            setAbsoluteMaxPrice(calculatedMax);
            setMaxPrice(calculatedMax);
            setLocalMin(0);
            setLocalMax(calculatedMax);
          }

          if (state?.searchQuery) setSearchQuery(state.searchQuery);
          if (state?.category) setSelectedCategories([state.category.toLowerCase()]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [state]);

  // Derived filter tags
  const getActiveFilters = () => {
    const tags = [];
    if (searchQuery) tags.push({ type: 'search', label: `Search: ${searchQuery}`, action: () => setSearchQuery("") });
    selectedCategories.forEach(cat => tags.push({ type: 'category', label: cat, action: () => toggleCategory(cat) }));
    if (selectedRating > 0) tags.push({ type: 'rating', label: `${selectedRating}+ Stars`, action: () => setSelectedRating(0) });
    if (minPrice > 0 || maxPrice < absoluteMaxPrice) tags.push({ type: 'price', label: `₹${minPrice}-₹${maxPrice}`, action: () => { setMinPrice(0); setMaxPrice(absoluteMaxPrice); } });
    if (onlyInStock) tags.push({ type: 'stock', label: 'In Stock Only', action: () => setOnlyInStock(false) });
    return tags;
  };

  // Filter Logic
  useEffect(() => {
    let result = [...data];

    // Search
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) || 
            item.category.toLowerCase().includes(lowerQuery)
        );
    }

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category.toLowerCase()));
    }

    // Price
    result = result.filter(product => {
        const price = parseFloat(product.price);
        return price >= minPrice && price <= maxPrice;
    });

    // Rating
    if (selectedRating > 0) {
      result = result.filter(product => {
        const rating = parseFloat(product.ratingRate || product.rating?.rate || 0);
        return rating >= selectedRating;
      });
    }

    // Mock Stock Availability (Random for demo if field doesn't exist)
    if (onlyInStock) {
        result = result.filter(p => (p.id % 5 !== 0)); // Just a mock condition
    }

    // Sorting
    if (sortBy === 'price-low') {
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high') {
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'rating') {
        result.sort((a, b) => {
            const rA = parseFloat(a.ratingRate || a.rating?.rate || 0);
            const rB = parseFloat(b.ratingRate || b.rating?.rate || 0);
            return rB - rA;
        });
    }

    // Apply filters
    setFilter(result);
    setCurrentPage(1); // Reset to first page when dynamic filters change
  }, [data, searchQuery, selectedCategories, minPrice, maxPrice, selectedRating, onlyInStock, sortBy]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filter.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filter.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of grid area instead of whole page if possible, 
    // but window scroll is safer for now.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Aggressive scroll stabilization
  const lastScrollY = React.useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useLayoutEffect(() => {
    if (filter.length >= 0) {
        window.scrollTo({
            top: lastScrollY.current,
            behavior: 'instant'
        });
    }
  }, [filter]);

  const toggleCategory = (cat) => {
    const lowerCat = cat.toLowerCase();
    setSelectedCategories(prev => 
      prev.includes(lowerCat) ? prev.filter(c => c !== lowerCat) : [...prev, lowerCat]
    );
  };
  
  const resetFilters = () => {
      setSearchQuery("");
      setSelectedCategories([]);
      setMinPrice(0);
      setMaxPrice(absoluteMaxPrice);
      setLocalMin(0);
      setLocalMax(absoluteMaxPrice);
      setSelectedRating(0);
      setOnlyInStock(false);
      setSortBy('recommended');
      toast.success("All filters cleared");
  };

  const activeFilterTags = getActiveFilters();

  const sidebarProps = {
    data,
    searchQuery, setSearchQuery,
    selectedCategories, toggleCategory,
    minPrice, maxPrice, setMinPrice, setMaxPrice,
    localMin, setLocalMin, localMax, setLocalMax,
    absoluteMaxPrice,
    onlyInStock, setOnlyInStock,
    selectedRating, setSelectedRating,
    resetFilters
  };

  return (
    <>
      <Navbar />
      
      {/* Header with Breadcrumb */}
      <div className="bg-white border-bottom py-4">
          <div className="container px-lg-5">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                      <h2 className="fw-bolder mb-1">Our Collection</h2>
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                          <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">Shop All Products</li>
                        </ol>
                      </nav>
                  </div>
                  <div className="d-flex align-items-center gap-3 bg-light p-2 rounded-3">
                      <div className="text-muted small px-2 border-end d-none d-sm-block">Sort By</div>
                      <select 
                        className="form-select form-select-sm border-0 bg-transparent fw-bold shadow-none" 
                        style={{width: '180px'}}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                          <option value="recommended">Best Match</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="newest">New Arrivals</option>
                          <option value="rating">Customer Reviews</option>
                      </select>
                  </div>
              </div>
          </div>
      </div>

      <div className="container px-lg-5 my-5">
        <div className="row g-4">
            {/* Sidebar Desktop */}
            <div className="col-lg-3 d-none d-lg-block">
                <div className="position-sticky" style={{ top: '90px', zIndex: 100, alignSelf: 'flex-start' }}>
                   <FilterSidebar {...sidebarProps} />
                </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
                 {/* Active Filters & Info */}
                 <div className="mb-4">
                     <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                          <p className="mb-0 text-muted small">
                             Showing <span className="text-dark fw-bold">{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filter.length)}</span> of <span className="text-dark fw-bold">{filter.length}</span> individual products
                          </p>
                         <button 
                            className="btn btn-dark d-lg-none btn-sm px-3 rounded-pill fw-bold"
                            type="button" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#mobileFilterCanvas"
                         >
                             <i className="fa fa-filter me-2"></i> FILTERS
                         </button>
                     </div>

                     {activeFilterTags.length > 0 && (
                         <div className="d-flex flex-wrap gap-2 mt-3">
                             {activeFilterTags.map((tag, i) => (
                                 <span key={i} className="badge bg-light text-dark border py-2 px-3 rounded-pill fw-medium d-flex align-items-center gap-2">
                                     {tag.label}
                                     <i className="fa fa-times cursor-pointer opacity-50 hover-opacity-100" onClick={tag.action}></i>
                                 </span>
                             ))}
                             <button className="btn btn-link btn-sm text-dark fw-bold text-decoration-none p-0 ps-2" onClick={resetFilters}>Clear all</button>
                         </div>
                     )}
                 </div>

                {/* Products Grid Wrapper */}
                <div className="products-grid-wrapper" style={{ minHeight: '600px' }}>
                  <div className="row g-4 products-grid-container mb-5">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(n => (
                            <div className="col-xl-4 col-md-6 col-sm-6" key={n}>
                                <Skeleton height={400} borderRadius={20} />
                            </div>
                        ))
                     ) : filter.length > 0 ? (
                        currentProducts.map(product => <ProductCard key={product.id} product={product} dispatch={dispatch} />)
                     ) : (
                        <div className="col-12 py-5 my-5 text-center">
                            <div className="mb-4">
                                <span className="display-1 text-muted opacity-10"><i className="fa fa-search-minus"></i></span>
                            </div>
                            <h3 className="fw-bold text-dark mb-2">No matching items found</h3>
                            <p className="text-muted mx-auto" style={{maxWidth: '400px'}}>We couldn't find any products matching your current filters. Try removing some filters or searching for something else.</p>
                            <button className="btn btn-dark rounded-pill px-5 py-2 mt-4 fw-bold shadow" onClick={resetFilters}>Reset All Filters</button>
                        </div>
                    )}
                  </div>
                </div>

                {/* Pagination Dynamic */}
                {!loading && filter.length > productsPerPage && (
                    <div className="d-flex justify-content-center mt-5 pt-5 border-top">
                         <ul className="pagination pagination-rounded gap-2">
                             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                 <button 
                                    className="page-link border-0 shadow-sm rounded-3 text-dark" 
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                 >
                                     <i className="fa fa-angle-left"></i>
                                 </button>
                             </li>
                             
                             {[...Array(totalPages)].map((_, i) => (
                                 <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                     <button 
                                        className={`page-link border-0 shadow-sm rounded-3 ${currentPage === i + 1 ? 'bg-dark text-white' : 'text-dark'}`}
                                        onClick={() => paginate(i + 1)}
                                     >
                                         {i + 1}
                                     </button>
                                 </li>
                             ))}

                             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                 <button 
                                    className="page-link border-0 shadow-sm rounded-3 text-dark" 
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                 >
                                     <i className="fa fa-angle-right"></i>
                                 </button>
                             </li>
                         </ul>
                     </div>
                 )}
            </div>
        </div>
      </div>

      {/* Mobile Offcanvas Filters */}
      <div className="offcanvas offcanvas-start rounded-end-4" tabIndex="-1" id="mobileFilterCanvas" style={{width: '320px'}}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">REFINE SEARCH</h5>
          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <FilterSidebar {...sidebarProps} />
        </div>
      </div>

      <Footer />

      <style>{`
        .product-card {
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .product-card:hover {
            box-shadow: 0 15px 40px rgba(0,0,0,0.08) !important;
        }
        .product-card:hover .product-actions {
            opacity: 1 !important;
            transform: translateY(-8px) !important;
        }
        .btn-white {
            background: white;
            border: none;
        }
        .btn-white:hover {
            background: #000;
        }
        .btn-white:hover i {
            color: #fff !important;
        }
        .font-xs { font-size: 0.65rem; }
        .font-sm { font-size: 0.8rem; }
        .cursor-pointer { cursor: pointer; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .pagination-rounded .page-link {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .custom-range::-webkit-slider-thumb {
            background: #000;
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            cursor: pointer;
        }
        .custom-range::-moz-range-thumb {
            background: #000;
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            cursor: pointer;
        }
        .custom-range {
            pointer-events: none;
        }
        .custom-range::-webkit-slider-thumb {
            pointer-events: auto;
        }
        .custom-range::-moz-range-thumb {
            pointer-events: auto;
        }
        
        /* New Dual Range Slider Styles */
        .price-range-input {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            background: transparent;
            outline: none;
        }
        
        .price-range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: #fff;
            border: 3px solid #000;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
        }
        
        .price-range-input::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
        }
        
        .price-range-input::-webkit-slider-thumb:active {
            transform: scale(1.05);
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        
        .price-range-input::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #fff;
            border: 3px solid #000;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
        }
        
        .price-range-input::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
        }
        
        .price-range-input::-moz-range-thumb:active {
            transform: scale(1.05);
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        
        .price-slider-container {
            padding: 0;
            margin: 0;
        }
        
        .price-slider-track {
            background: #e9ecef !important;
        }
        
        .price-slider-range {
            background: #000 !important;
            transition: left 0.1s ease, right 0.1s ease;
        }
        
        .custom-checkbox .form-check-input:checked {
            background-color: #000;
            border-color: #000;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bbb; }
        
        /* Prevent layout shift */
        html {
            scroll-behavior: smooth;
        }
        .position-sticky {
            position: -webkit-sticky;
            position: sticky;
        }
        
         /* Prevent page jump when filtering */
         .products-grid-container {
             min-height: auto;
             overflow-anchor: auto !important;
             padding-bottom: 50px;
         }
         
         body {
             overflow-anchor: auto !important;
         }
       `}</style>
    </>
  );
};

export default Products;