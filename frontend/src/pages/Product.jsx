import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactImageMagnify from 'react-image-magnify';
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import { addWishlist } from "../redux/slices/wishlistSlice";
import toast from "react-hot-toast";
import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [activeImg, setActiveImg] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [showModal, setShowModal] = useState(false);

  const isVideo = (url) => url?.endsWith(".mp4");

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addItem(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setActiveImg(data.image);
      setLoading(false);
      const response2 = await fetch(
        `http://localhost:5000/api/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  // Removed handleMouseMove and handleMouseLeave as we are using a library now




  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };


  const ShowProduct = () => {
    // Generate gallery images (Main + Similar + Mock Video)
    // Generate gallery images (Main + Similar + Mock Video)
    // Ensure we have exactly 5 items (or fallback)
    const galleryImages = [
        { type: 'image', url: product.image, thumb: product.image },
        ...(similarProducts.length >= 3 
            ? similarProducts.slice(0, 3).map(p => ({ type: 'image', url: p.image, thumb: p.image }))
            : [ // Fallback if not enough similar products (duplicate main for demo)
                { type: 'image', url: product.image, thumb: product.image },
                { type: 'image', url: product.image, thumb: product.image },
                { type: 'image', url: product.image, thumb: product.image }
              ].slice(0, 3) 
        ),
        { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumb: 'https://via.placeholder.com/150/000000/FFFFFF/?text=PLAY' }
    ];

    // Ensure activeImg is initialized correctly if empty (useEffect might be slow)
    // Note: logic in useEffect sets activeImg string. We need to handle that.
    
    const currentActiveUrl = activeImg || product.image;
    const isCurrentVideo = isVideo(currentActiveUrl);

    return (
      <>
        <div className="container my-5 py-4">
          <div className="row g-4">
             {/* Left Column: Gallery & Main Image */}
             <div className="col-lg-7">
                <div className="row g-2">
                    {/* Thumbnails (Vertical on Desktop) */}
                    <div className="col-12 col-md-2 order-2 order-md-1">
                        <div className="d-flex flex-md-column gap-2 justify-content-center justify-content-md-start">
                            {galleryImages.map((item, index) => (
                                <div 
                                    key={index} 
                                    className={`border rounded-0 p-1 cursor-pointer transition-all position-relative ${currentActiveUrl === item.url ? 'border-dark opacity-100' : 'border-light opacity-75 hover-opacity-100'}`}
                                    onClick={() => setActiveImg(item.url)}
                                    style={{width: '70px', height: '70px', cursor: 'pointer'}}
                                >
                                    <img src={item.thumb} alt={`Thumb ${index}`} className="w-100 h-100 object-fit-contain" />
                                    {item.type === 'video' && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 text-white" style={{fontSize: '0.8rem'}}>
                                            <i className="fa fa-play-circle"></i>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Image with Zoom */}
                    <div className="col-12 col-md-10 order-1 order-md-2 position-relative">
                        <div 
                            className="border border-light rounded-0 shadow-sm bg-white d-flex align-items-center justify-content-center position-relative p-3" 
                            style={{minHeight: '500px'}}
                        >
                            {isCurrentVideo ? (
                                <video 
                                    className="w-100 h-100 object-fit-contain" 
                                    src={currentActiveUrl} 
                                    controls 
                                    autoPlay 
                                    muted 
                                    style={{maxHeight: '400px'}}
                                />
                            ) : (
                                <div className="w-100 h-100 z-10" onClick={() => setShowModal(true)}>
                                    <ReactImageMagnify {...{
                                        smallImage: {
                                            alt: product.title,
                                            isFluidWidth: true,
                                            src: currentActiveUrl,
                                            srcSet: currentActiveUrl, // Optional
                                        },
                                        largeImage: {
                                            src: currentActiveUrl,
                                            width: 1200, // High-res width
                                            height: 1200 // High-res height
                                        },
                                        enlargedImageContainerDimensions: {
                                            width: '100%',
                                            height: '100%'
                                        },
                                        isHintEnabled: true,
                                        shouldHideHintAfterFirstActivation: false,
                                        enlargedImageContainerStyle: { zIndex: 9999, background: '#fff' }
                                    }} />
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-3">
                             <button className="btn btn-link text-decoration-none text-muted fw-bold text-uppercase small" onClick={() => setShowModal(true)} style={{letterSpacing: '1px'}}>
                                <i className="fa fa-expand me-2"></i> Click to see full view
                             </button>
                        </div>
                    </div>
                </div>
             </div>

             {/* Right Column: Product Details */}
             <div className="col-lg-5 ps-lg-5">
                <h5 className="text-uppercase text-muted fw-bold mb-2 tracking-wide" style={{fontSize: '0.8rem', letterSpacing: '2px'}}>{product.category}</h5>
                <h1 className="fw-bold text-dark mb-3 lh-sm" style={{fontSize: '2.5rem'}}>{product.title}</h1>
                
                <div className="d-flex align-items-center mb-4">
                   <div className="text-warning fs-6 me-3">
                       {product.rating && product.rating.rate} <i className="fa fa-star"></i>
                   </div>
                   <span className="text-muted small border-start ps-3">{product.rating && product.rating.count} Verified Reviews</span>
                </div>

                <h2 className="fw-bold text-dark mb-4 display-6">
                  <span className="text-muted text-decoration-line-through fs-4 me-3 text-lighter opacity-50 fw-normal"><i className="fa fa-inr"></i> {Math.round(product.price * 1.3)}</span>
                  <i className="fa fa-inr"></i> {product.price}
                </h2>
                
                <p className="text-secondary mb-5 lh-lg" style={{fontSize: '0.95rem'}}>{product.description}</p>
                
                <div className="d-flex gap-3 flex-wrap">
                    <button
                        className="btn btn-dark btn-lg rounded-0 px-5 fw-bold text-uppercase tracking-wide"
                        onClick={() => {
                            toast.success("Added to cart");
                            addProduct(product)}
                        }
                        style={{letterSpacing: '1px'}}
                    >
                        Add to Bag
                    </button>
                    <Link to="/cart" className="btn btn-outline-dark btn-lg rounded-0 px-5 fw-bold text-uppercase tracking-wide" style={{letterSpacing: '1px'}}>
                        Go to Cart
                    </Link>
                    <button
                        className="btn btn-outline-dark btn-lg rounded-0 px-4"
                        onClick={() => {
                            dispatch(addWishlist(product));
                            toast.success("Added to Wishlist");
                        }}
                        title="Add to Wishlist"
                    >
                        <i className="fa fa-heart-o"></i>
                    </button>
                </div>
                
                <div className="mt-5 pt-4 border-top">
                    <div className="d-flex gap-4 small text-uppercase fw-bold text-muted">
                        <span><i className="fa fa-truck me-2"></i>Free Delivery</span>
                        <span><i className="fa fa-refresh me-2"></i>30 Days Return</span>
                        <span><i className="fa fa-shield me-2"></i>Secure Payment</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Gallery Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered contentClassName="border-0 rounded-0" scrollable={false}>
            <Modal.Header closeButton className="border-0 pb-0">
                <div className="d-flex gap-4 fw-bold text-uppercase border-bottom border-dark pb-2" style={{letterSpacing: '1px', fontSize: '0.9rem', width: 'fit-content'}}>
                    <span className="text-dark cursor-pointer">Images & Videos</span>
                </div>
            </Modal.Header>
            <Modal.Body className="p-0" style={{height: '80vh', overflow: 'hidden'}}>
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        {/* Left: Main View */}
                        <div className="col-lg-8 bg-light d-flex align-items-center justify-content-center p-4">
                             {isCurrentVideo ? (
                                <video 
                                    className="w-100 h-100" 
                                    src={currentActiveUrl} 
                                    controls 
                                    autoPlay 
                                    style={{objectFit: 'contain'}}
                                />
                             ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center overflow-auto">
                                     <img 
                                        src={currentActiveUrl} 
                                        alt="Full View" 
                                        className="img-fluid" 
                                        style={{maxHeight: '100%', objectFit: 'contain'}}
                                     />
                                </div>
                             )}
                        </div>

                        {/* Right: Gallery Grid */}
                        <div className="col-lg-4 bg-white h-100 overflow-auto p-4 border-start">
                            <h4 className="fw-bold mb-1" style={{fontFamily: 'Playfair Display, serif'}}>{product.title}</h4>
                            <p className="text-muted small mb-4">{product.category}</p>
                            
                            <h6 className="fw-bold text-uppercase text-muted small mb-3">Media Gallery</h6>
                            <div className="row g-2">
                                {galleryImages.map((item, index) => (
                                    <div className="col-4" key={index}>
                                        <div 
                                            className={`ratio ratio-1x1 border rounded cursor-pointer position-relative ${currentActiveUrl === item.url ? 'border-dark shadow-sm' : 'border-light hover-opacity'}`}
                                            onClick={() => setActiveImg(item.url)}
                                        >
                                            <img src={item.thumb} className="object-fit-contain p-2" alt="Thumb"/>
                                             {item.type === 'video' && (
                                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 text-white">
                                                    <i className="fa fa-play-circle fs-4"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
      </>
    );
  };


  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex gap-4 overflow-hidden">
             {[1, 2, 3, 4].map((item) => (
                <div key={item} className="p-3 border rounded shadow-sm" style={{minWidth: '250px'}}>
                   <Skeleton height={200} />
                   <Skeleton height={20} className="mt-2" />
                   <Skeleton height={20} width={100} />
                </div>
             ))}
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex gap-4">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card border h-100 shadow-sm rounded-4 overflow-hidden text-center p-3" style={{minWidth: '250px', maxWidth: '280px'}}>
                  <div style={{height: '200px'}} className="d-flex align-items-center justify-content-center mb-3">
                      <img
                        className="img-fluid object-fit-contain"
                        src={item.image}
                        alt="Card"
                        style={{maxHeight: '180px'}}
                      />
                  </div>
                  <div className="card-body p-0">
                    <h6 className="card-title text-truncate fw-bold mb-2">
                       {item.title}
                    </h6>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold"><i className="fa fa-inr"></i> {item.price}</span>
                        <button
                            className="btn btn-sm btn-outline-dark rounded-pill fw-bold"
                            onClick={() => addProduct(item)}
                        >
                            <i className="fa fa-plus"></i> Add
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
