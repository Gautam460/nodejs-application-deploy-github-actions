import React from 'react'
import { Footer, Navbar } from "../components";
import { motion } from "framer-motion";
import { contentApi } from "../api/content.api";

const AboutPage = () => {
  const [sections, setSections] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [headerSettings, setHeaderSettings] = React.useState({
      siteTagline: "Curated Fashion for the Modern Soul",
      siteName: "Prince Garments"
  });

  const [aboutBanner, setAboutBanner] = React.useState(null);

  React.useEffect(() => {
    const fetchContent = async () => {
        try {
            // Fetch site settings first
            const settingsRes = await contentApi.getSettings();
            if(settingsRes.data) {
                setHeaderSettings(settingsRes.data);
            }

            // Fetch about page banner
            const bannerRes = await contentApi.getBanners('about');
            if (bannerRes.data && bannerRes.data.length > 0) {
                // Use the last added active banner for 'about' position
                const activeBanners = bannerRes.data.filter(b => b.active);
                if (activeBanners.length > 0) {
                  setAboutBanner(activeBanners[activeBanners.length - 1]);
                }
            }

            // Fetch about sections
            const res = await contentApi.getAboutSections();
            if(res.data) {
                const data = res.data;
                if(Array.isArray(data) && data.length > 0) {
                     setSections(data);
                } else {
                    setSections([]); 
                }
            }

            // Fetch featured categories
            const catRes = await contentApi.getFeaturedCategories();
            if(catRes.data && Array.isArray(catRes.data)) {
                setCategories(catRes.data);
            }

        } catch(e) {
            console.error("Error fetching content:", e);
        }
    }
    fetchContent();
  }, []);

  // Sections filter
  const contentSections = sections.filter(s => (!s.type || s.type === 'content') && s.active);
  const valueSections = sections.filter(s => s.type === 'value' && s.active);

  /* Safe fallback image logic */
  const defaultHeroImage = "https://placehold.co/1500x400?text=Fashion+Hero";
  
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
    e.target.onerror = null; 
  };

  return (
    <>
      <Navbar />
      {/* Hero Section - Dynamic or Default */}
      <div className="position-relative" style={{ height: "250px" }}>
         <img 
            src={aboutBanner ? aboutBanner.image : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"} 
            alt="About Hero" 
            className="w-100 h-100 object-fit-cover"
            onError={handleImageError}
         />
         <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
         <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
            <h1 className="display-4 fw-bold mb-2 tracking-wide">
                {aboutBanner ? aboutBanner.title : "Our Story"}
            </h1>
            <p className="fs-6 fw-light text-uppercase tracking-wider opacity-90">
                {aboutBanner ? aboutBanner.subtitle : (headerSettings.siteTagline || "Crafting Excellence")}
            </p>
         </div>
      </div>

      <div className="container my-5 py-5">
        {contentSections.map((section, index) => (
            <div className="row align-items-center mb-5" key={section.id}>
                <div className={`col-lg-6 mb-4 mb-lg-0 ${index % 2 !== 0 ? 'order-lg-2' : ''}`}>
                    <img 
                        src={section.image || "https://placehold.co/600x400?text=No+Image"} 
                        alt={section.title} 
                        className="img-fluid rounded-0 shadow w-100"
                        style={{minHeight: '300px', maxHeight:'400px', objectFit:'cover'}}
                        onError={handleImageError}
                    />
                </div>
                <div className={`col-lg-6 ${index % 2 !== 0 ? 'pe-lg-5 order-lg-1' : 'ps-lg-5'}`}>
                    <h5 className="text-warning text-uppercase fw-bold letter-spacing-2 mb-2">{section.title}</h5>
                    {section.subtitle && <h2 className="display-6 fw-bold mb-4 text-dark">{section.subtitle}</h2>}
                    <div className="text-muted lead fs-6 lh-lg mb-4" dangerouslySetInnerHTML={{ __html: section.content }}></div>
                </div>
            </div>
        ))}

        {/* Dynamic Values Section */}
        {valueSections.length > 0 && (
             <div className="row g-4 mt-5">
                {valueSections.map((value, idx) => (
                    <div className="col-md-6 col-lg-4" key={value.id || idx}>
                        <div className="d-flex flex-column align-items-center text-center p-4 border rounded shadow-sm bg-white h-100 hover-shadow transition-all">
                             <div className="bg-light p-4 rounded-circle mb-3">
                                <i className={`fa ${value.subtitle && value.subtitle.startsWith('fa-') ? value.subtitle : 'fa-star'} text-warning fs-2`}></i>
                             </div>
                             <h4 className="fw-bold mb-2">{value.title}</h4>
                             <div className="text-muted small" dangerouslySetInnerHTML={{ __html: value.content }}></div>
                        </div>
                    </div>
                ))}
             </div>
        )}

        {/* Dynamic Categories Section */}
        {categories.length > 0 && (
            <>
                <h2 className="text-center py-5 fw-bold display-6 mt-4">Our Collections</h2>
                <div className="row g-4">
                  {categories.map((cat) => (
                      <div className="col-md-3 col-sm-6" key={cat.id}>
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all group-hover-zoom">
                          <div className="overflow-hidden rounded-top-3">
                            <img 
                                className="card-img-top img-fluid" 
                                src={cat.image || "https://placehold.co/600x400?text=Category"} 
                                alt={cat.name} 
                                style={{height: '250px', objectFit: 'cover', transition: 'transform 0.3s'}}
                                onError={handleImageError} 
                            />
                          </div>
                          <div className="card-body text-center bg-light">
                            <h5 className="card-title fw-bold mb-0">{cat.name}</h5>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            </>
        )}
      </div>
      <Footer />
    </>
  )
}

export default AboutPage