import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addItem(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/products");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(6)].map((_, i) => (
          <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" key={i}>
            <Skeleton height={592} borderRadius={10} />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 py-2 rounded-pill fw-bold"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 py-2 rounded-pill fw-bold"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 py-2 rounded-pill fw-bold"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 py-2 rounded-pill fw-bold"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 py-2 rounded-pill fw-bold"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        <motion.div layout className="row justify-content-center">
          <AnimatePresence>
            {filter.map((product) => {
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  id={product.id}
                  key={product.id}
                  className="col-md-3 col-sm-6 col-6 mb-4" // Changed to col-md-3 for 4 items per row
                >
                  <div className="card h-100 border-0 shadow-sm product-card overflow-hidden" style={{fontSize: '0.9rem'}}>
                    <div className="p-3 text-center overflow-hidden position-relative" style={{ height: "200px" }}> {/* Reduced height */}
                        <Link to={"/product/" + product.id}>
                            <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="card-img-top object-fit-contain h-100"
                            src={product.image}
                            alt={product.title}
                            />
                        </Link>
                    </div>
                    <div className="card-body p-3 d-flex flex-column">
                      <Link to={"/product/" + product.id} className="text-decoration-none text-dark">
                          <h6 className="card-title text-truncate mb-1" style={{fontWeight: '600'}}>
                            {product.title}
                          </h6>
                      </Link>
                      
                      {/* Star Rating Dummy */}
                      <div className="mb-1 text-warning" style={{fontSize: '0.8rem'}}>
                         <i className="fa fa-star"></i>
                         <i className="fa fa-star"></i>
                         <i className="fa fa-star"></i>
                         <i className="fa fa-star"></i>
                         <i className="fa fa-star-half-o"></i>
                         <span className="text-muted ms-1 text-secondary">(120)</span>
                      </div>

                      <div className="mt-auto">
                          <p className="card-text fw-bold mb-2 fs-5">
                             <i className="fa fa-inr"></i> {product.price}
                             <span className="text-muted text-decoration-line-through ms-2 fs-6 fw-normal"><i className="fa fa-inr"></i> {(product.price * 1.2).toFixed(2)}</span>
                          </p>
                          <button
                            className="btn btn-warning btn-sm w-100 fw-bold rounded-pill" // Amazon style yellow button
                            onClick={() => {
                              toast.success("Added to cart");
                              addProduct(product);
                            }}
                          >
                            Add to Cart
                          </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center fw-bold">Latest Products</h2>
            <hr className="w-25 mx-auto text-dark opacity-100" />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
