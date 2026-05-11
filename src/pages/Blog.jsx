import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '../components';
import { contentApi } from '../api/content.api';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [blogBanner, setBlogBanner] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
        try {
            const res = await contentApi.getBlogPosts();
            if(res.data) {
                setBlogPosts(res.data);
                // Set first post as featured if available
                if(res.data.length > 0) {
                    setFeaturedPost(res.data[0]);
                }
            }

            // Fetch blog banner
            const bannerRes = await contentApi.getBanners('blog');
            if (bannerRes.data && bannerRes.data.length > 0) {
                 const activeBanners = bannerRes.data.filter(b => b.active);
                 if (activeBanners.length > 0) {
                     setBlogBanner(activeBanners[activeBanners.length - 1]);
                 }
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchBlog();
  }, []);
  
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Filter out featured post from grid if needed, or just show all
  const gridPosts = featuredPost ? blogPosts.filter(p => p.id !== featuredPost.id) : blogPosts;

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className="position-relative" style={{ height: "250px" }}>
         <img 
            src={blogBanner ? blogBanner.image : "https://via.placeholder.com/1500x200?text=The+Journal"} 
            alt="Blog Hero" 
            className="w-100 h-100 object-fit-cover"
         />
         <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
         <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
             <h1 className="display-4 fw-bold mb-2 tracking-wide">
                {blogBanner ? blogBanner.title : "The Journal"}
            </h1>
            <p className="fs-6 fw-light text-uppercase tracking-wider opacity-90">
                {blogBanner ? blogBanner.subtitle : "Stories of Style & Substance"}
            </p>
         </div>
      </div>

      <div className="container my-5 py-5">
        <div className="row g-5">
            {/* Featured Post - Dynamic */}
            {featuredPost ? (
                <div className="col-12 mb-4">
                    <div className="card border-0 shadow-sm overflow-hidden text-white rounded-0">
                        <div className="position-relative" style={{ height: '500px' }}>
                            <img 
                                src={featuredPost.image || "https://via.placeholder.com/1600x500?text=Featured+Article"} 
                                className="w-100 h-100 object-fit-cover" 
                                alt={featuredPost.title} 
                            />
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                            <div className="position-absolute bottom-0 start-0 p-5">
                                <span className="badge bg-warning text-dark text-uppercase rounded-0 mb-3 px-3 py-2">Editor's Pick</span>
                                <h2 className="display-5 fw-bold mb-3">{featuredPost.title}</h2>
                                <p className="lead mb-4 d-none d-md-block" style={{ maxWidth: '600px' }}>{featuredPost.excerpt}</p>
                                <button className="btn btn-outline-light rounded-0 px-4 py-2 text-uppercase fw-bold tracking-wide">Read Article</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Fallback static featured post if no data (using placeholder)
                <div className="col-12 mb-4">
                    <div className="card border-0 shadow-sm overflow-hidden text-white rounded-0">
                         <div className="position-relative" style={{ height: '500px' }}>
                            <img src="https://via.placeholder.com/1600x500?text=Featured+Article" className="w-100 h-100 object-fit-cover" alt="Featured" />
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                            <div className="position-absolute bottom-0 start-0 p-5">
                                <h2 className="display-5 fw-bold mb-3">Defining the New Era</h2>
                                <p className="lead mb-4 d-none d-md-block" style={{ maxWidth: '600px' }}>No posts available.</p>
                            </div>
                         </div>
                    </div>
                </div>
            )}

            {/* Grid Posts */}
            {gridPosts.map((post) => (
                <div key={post.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all rounded-0">
                        <div className="overflow-hidden position-relative group" style={{ height: '250px' }}>
                            <img 
                                src={post.image || "https://via.placeholder.com/800x600?text=Blog+Post"} 
                                className="card-img-top w-100 h-100 object-fit-cover transition-transform duration-500 hover-scale-110" 
                                alt={post.title} 
                            />
                            <div className="position-absolute top-0 end-0 bg-white px-3 py-1 mt-3 me-3 text-uppercase fw-bold small shadow-sm">
                                {post.category || 'News'}
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-2 text-muted small text-uppercase tracking-wider">{formatDate(post.date)}</div>
                            <h4 className="card-title fw-bold mb-3">{post.title}</h4>
                            <p className="card-text text-secondary mb-4 small lh-base">{post.excerpt}</p>
                            <a href="#" className="text-dark fw-bold text-decoration-none text-uppercase small tracking-wide border-bottom border-dark pb-1 hover-opacity">Read More</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>

         <div className="row mt-5">
            <div className="col-12 text-center">
                 <button className="btn btn-outline-dark btn-lg rounded-0 px-5 text-uppercase fw-bold tracking-wide">Load More Stories</button>
            </div>
         </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
