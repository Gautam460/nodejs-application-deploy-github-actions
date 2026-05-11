import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addItem, deleteItem, removeItem } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const state = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Selection State: Default to all selected
  const [selectedItems, setSelectedItems] = useState([]);

  // Sync selection when cart items change (e.g. initial load or add/remove)
  useEffect(() => {
     // If we have items and selection is empty (first load), select all.
     // Or if items changed, ensure we only keep valid IDs.
     // For simplicity: auto-select new items, keep existing selection status.
     const currentIds = state.map(item => item.id);
     
     // Simple approach: Check if we just loaded
     if (selectedItems.length === 0 && state.length > 0) {
         setSelectedItems(currentIds);
     } else {
         // Filter out IDs that no longer exist
         setSelectedItems(prev => prev.filter(id => currentIds.includes(id)));
     }
     // eslint-disable-next-line
  }, [state.length]);


  const EmptyCart = () => {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 py-5 bg-light text-center rounded shadow-sm fade-in">
             <div className="mb-4">
                 <i className="fa fa-shopping-cart fa-4x text-muted opacity-50"></i>
             </div>
            <h4 className="display-6 fw-bold text-dark mb-3">Your Cart is Empty</h4>
            <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="btn btn-dark btn-lg px-5 rounded-pill shadow-sm">
              <i className="fa fa-arrow-left me-2"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItemToCart = (product) => dispatch(addItem(product));
  const decreaseItemQty = (product) => dispatch(deleteItem(product)); // Decrease qty
  const removeItemFromCart = (product) => {
      dispatch(removeItem(product)); // Remove completely
      toast.success("Item removed from cart");
  };
  const saveForLater = (product) => {
      dispatch(removeItem(product)); // Check scope: usually moves to Wishlist, but for now remove from cart
      toast.success("Saved for later (Moved from Cart)");
  };

  const toggleSelect = (id) => {
      if (selectedItems.includes(id)) {
          setSelectedItems(selectedItems.filter(x => x !== id));
      } else {
          setSelectedItems([...selectedItems, id]);
      }
  };

  const toggleSelectAll = () => {
      if (selectedItems.length === state.length) {
          setSelectedItems([]); // Deselect all
      } else {
          setSelectedItems(state.map(x => x.id)); // Select all
      }
  };

  const ShowCart = () => {
    let subtotal = 0;
    let totalQty = 0;

    // Calculate totals only for selected items
    state.forEach((item) => {
      if (selectedItems.includes(item.id)) {
        subtotal += item.price * item.qty;
        totalQty += item.qty;
      }
    });

    const isAllSelected = state.length > 0 && selectedItems.length === state.length;

    return (
      <>
        <section className="h-100" style={{ backgroundColor: "#eaeded" }}>
          <div className="container py-4">
            <div className="row d-flex justify-content-center">
              <div className="col-md-12 col-lg-8">
                <div className="card border-0 shadow-sm rounded-3 mb-4">
                  <div className="card-header py-3 bg-white border-bottom d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold">Shopping Cart</h5>
                    <div className="form-check cursor-pointer user-select-none">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="selectAll" 
                            checked={isAllSelected} 
                            onChange={toggleSelectAll} 
                            style={{cursor: 'pointer'}}
                        />
                        <label className="form-check-label text-muted small fw-bold" htmlFor="selectAll" style={{cursor: 'pointer'}}>
                            {isAllSelected ? "Deselect all items" : "Select all items"}
                        </label>
                    </div>
                  </div>
                  
                  <div className="card-body p-0">
                    {state.map((item) => {
                      const isSelected = selectedItems.includes(item.id);
                      return (
                        <div key={item.id} className={`p-4 border-bottom ${isSelected ? 'bg-white' : 'bg-light bg-opacity-50'}`}>
                          <div className="row align-items-center">
                            {/* Checkbox & Image */}
                            <div className="col-auto">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={isSelected} 
                                    onChange={() => toggleSelect(item.id)}
                                    style={{width: 20, height: 20, cursor: 'pointer'}}
                                />
                            </div>
                            <div className="col-lg-3 col-md-3 col-4 mb-4 mb-lg-0">
                              <div className="bg-image rounded hover-overlay hover-zoom ripple overflow-hidden border">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-100 object-fit-contain"
                                  style={{maxHeight: "150px", objectFit: "contain"}}
                                />
                              </div>
                            </div>

                            <div className="col-lg-8 col-md-8 col-8">
                               <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <h5 className="text-dark mb-2">
                                        <Link to={`/product/${item.id}`} className="text-decoration-none text-dark hover-underline title-clamp">
                                            {item.title}
                                        </Link>
                                    </h5>
                                    
                                    <div className="small mb-2">
                                        <span className="text-success fw-bold">In Stock</span>
                                        <span className="text-muted mx-2">|</span>
                                        <span className="text-muted">Eligible for FREE Shipping</span>
                                    </div>
                                    
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="fw-bold fs-5 me-2"><i className="fa fa-inr small"></i> {item.price}</span>
                                    </div>

                                    {/* CONTROLS */}
                                    <div className="d-flex flex-wrap align-items-center gap-3">
                                        {/* Qty Control */}
                                        <div className="btn-group border rounded-pill" role="group">
                                             <button className="btn btn-sm btn-light px-3" onClick={() => decreaseItemQty(item)}>
                                                 <i className="fas fa-minus small"></i>
                                             </button>
                                             <span className="btn btn-sm btn-white px-3 fw-bold disabled border-0 text-dark" style={{opacity: 1}}>{item.qty}</span>
                                             <button className="btn btn-sm btn-light px-3" onClick={() => addItemToCart(item)}>
                                                 <i className="fas fa-plus small"></i>
                                             </button>
                                         </div>
                                         
                                         <div className="vr h-100 mx-2 text-muted"></div>
                                         
                                         <div className="d-flex gap-2">
                                             <button className="btn btn-sm btn-outline-danger border-0 rounded-pill px-3" onClick={() => removeItemFromCart(item)}>
                                                 <i className="fa fa-trash-o me-1"></i> <small>Delete</small>
                                             </button>
                                            <button className="btn btn-sm btn-outline-secondary border-0 rounded-pill px-3" onClick={() => saveForLater(item)}>
                                                <i className="fa fa-bookmark-o me-1"></i> <small>Save for later</small>
                                            </button>
                                        </div>
                                    </div>
                                 </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                     <div className="p-4 text-end bg-light bg-opacity-25">
                         <h5 className="mb-0">Subtotal ({totalQty} items): <span className="fw-bold text-dark"><i className="fa fa-inr"></i> {Math.round(subtotal)}</span></h5>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Summary Section */}
              <div className="col-md-12 col-lg-4">
                <div className="card mb-4 border-0 shadow-sm rounded-3">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3 text-success">
                        <i className="fa fa-check-circle me-2 fs-5"></i>
                        <span className="small fw-bold">Free Delivery applies to your order.</span>
                    </div>
                    
                    <h4 className="mb-4 text-center pb-3 border-bottom">
                        Subtotal: <span className="fw-bold"><i className="fa fa-inr"></i> {Math.round(subtotal)}</span>
                    </h4>
                    
                    <div className="form-check mb-4 bg-light p-2 rounded border">
                        <input className="form-check-input" type="checkbox" id="giftCheck" />
                        <label className="form-check-label small w-100" htmlFor="giftCheck">
                            This order contains a gift
                        </label>
                    </div>

                    <Link
                      to="/checkout"
                      className={`btn btn-warning btn-lg w-100 rounded-pill shadow-sm fw-bold tracking-wide ${totalQty === 0 ? 'disabled' : ''}`}
                    >
                      Proceed to Buy ({totalQty})
                    </Link>
                  </div>
                </div>
                
                 {/* Recommendations */}
                 <div className="card border-0 shadow-sm rounded-3">
                      <div className="card-body">
                          <h6 className="fw-bold text-muted mb-3 text-uppercase small ls-1">Customers who bought this also bought</h6>
                          <div className="d-flex flex-wrap gap-2 justify-content-center">
                               {/* Mock Recommendations */}
                               {[1, 2, 3].map(i => (
                                   <div key={i} className="border rounded p-2 text-center" style={{width: '90px'}}>
                                       <img src={`https://images.pexels.com/photos/${999000+i}/pexels-photo-${999000+i}.jpeg?auto=compress&cs=tinysrgb&w=100`} 
                                            className="mb-2 rounded object-fit-cover" 
                                            style={{height: 60, width: 60}} 
                                            alt="Rec"
                                            onError={(e) => e.target.src='https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100'} 
                                       />
                                       <p className="small text-danger fw-bold mb-0"><i className="fa fa-inr"></i> {499 * i}</p>
                                   </div>
                               ))}
                          </div>
                      </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light min-vh-100 pt-3">
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
