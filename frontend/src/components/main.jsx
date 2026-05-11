import React, { useMemo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../assets/css/styles.css";
// Kept for fallback in case of API error, but not used if API works
import img1 from "../assets/main_png.jpg";
import img2 from "../assets/main_png1.jpg";
import img3 from "../assets/main_png2.jpg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();
  
  const [slides, setSlides] = useState([]);
  
  // Default slides if API fails or while loading (optional, but good UX)
  const defaultSlides = useMemo(() => [
    { 
      image: img1, 
      title: t('hero.slide1_title'), 
      subtitle: t('hero.slide1_subtitle'),
      text: t('hero.slide1_text')
    },
    { 
      image: img2, 
      title: t('hero.slide2_title'), 
      subtitle: t('hero.slide2_subtitle'),
      text: t('hero.slide2_text')
    },
    { 
      image: img3, 
      title: t('hero.slide3_title'), 
      subtitle: t('hero.slide3_subtitle'),
      text: t('hero.slide3_text')
    },
  ], [t]);

  useEffect(() => {
    const fetchSlides = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/hero-slides");
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                     setSlides(data);
                } else {
                    setSlides(defaultSlides);
                }
            } else {
                setSlides(defaultSlides);
            }
        } catch (error) {
            console.error("Failed to fetch slides", error);
            setSlides(defaultSlides);
        }
    };
    fetchSlides();
  }, [defaultSlides]);


  return (
    <div className="hero-section">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={1200}
        className="h-100"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="position-relative h-100 w-100">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-100 h-100 object-fit-cover"
              />
              {/* Gradient Overlay */}
              <div className="position-absolute top-0 start-0 w-100 h-100" 
                   style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)" }}>
              </div>

              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-md-8 col-lg-6 text-white text-center text-md-start">
                      <motion.span
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-uppercase fw-bold text-warning mb-2 d-block tracking-wider"
                        style={{ letterSpacing: "3px", fontSize: "14px" }}
                      >
                        {slide.subtitle}
                      </motion.span>
                      <motion.h1 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="display-4 display-md-2 fw-bold mb-3 mb-md-4"
                        style={{ textShadow: "2px 2px 15px rgba(0,0,0,0.3)", lineHeight: "1.1" }}
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="lead fs-6 fs-md-4 mb-4 mb-md-5 opacity-75"
                        style={{ textShadow: "1px 1px 5px rgba(0,0,0,0.3)" }}
                      >
                        {slide.text}
                      </motion.p>
                       <motion.div
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.9 }}
                         className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start"
                       >
                         <Link to="/product" className="btn btn-light px-4 py-2 rounded-pill fw-bold shadow-sm text-uppercase tracking-wide border-2" style={{fontSize: '0.9rem'}}>
                           {t('hero.shop_now')}
                         </Link>
                         <Link to="/blog" className="btn btn-outline-light px-4 py-2 rounded-pill fw-bold shadow-sm text-uppercase tracking-wide border-2" style={{fontSize: '0.9rem'}}>
                           {t('hero.view_lookbook')}
                         </Link>
                       </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Navigation Buttons - Repositioned */}
        <div className="custom-prev d-none d-md-flex justify-content-center align-items-center">
             <i className="fa fa-arrow-left"></i>
        </div>
        <div className="custom-next d-none d-md-flex justify-content-center align-items-center">
             <i className="fa fa-arrow-right"></i>
        </div>
      </Swiper>
    </div>
  );
};

export default Home;
