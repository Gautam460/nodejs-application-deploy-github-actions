import api from './axios';

export const contentApi = {
    // Settings
    getSettings: () => api.get('/content/settings'),
    updateSettings: (data) => api.put('/content/settings', data),
    
    // Menu
    getMenuItems: () => api.get('/content/menu'),
    createMenuItem: (data) => api.post('/content/menu', data),
    updateMenuItem: (id, data) => api.put(`/content/menu/${id}`, data),
    deleteMenuItem: (id) => api.delete(`/content/menu/${id}`),
    
    // Hero Slides
    getHeroSlides: () => api.get('/hero-slides'),
    getHeroSlidesById: (id) => api.get(`/hero-slides/${id}`),
    createHeroSlide: (data) => api.post('/hero-slides', data),
    updateHeroSlide: (id, data) => api.put(`/hero-slides/${id}`, data),
    deleteHeroSlide: (id) => api.delete(`/hero-slides/${id}`),

    // About Sections
    getAboutSections: () => api.get('/content/about-sections'),
    createAboutSection: (data) => api.post('/content/about-sections', data),
    updateAboutSection: (id, data) => api.put(`/content/about-sections/${id}`, data),
    deleteAboutSection: (id) => api.delete(`/content/about-sections/${id}`),

    // Other Content
    // Banners
    getBanners: (position) => api.get(`/content/banners${position ? `?position=${position}` : ''}`),
    createBanner: (data) => api.post('/content/banners', data),
    updateBanner: (id, data) => api.put(`/content/banners/${id}`, data),
    deleteBanner: (id) => api.delete(`/content/banners/${id}`),
    getTestimonials: () => api.get('/content/testimonials'),
    getAnnouncements: () => api.get('/content/announcements'),
    // Featured Categories
    getFeaturedCategories: () => api.get('/content/categories'),
    createFeaturedCategory: (data) => api.post('/content/categories', data),
    updateFeaturedCategory: (id, data) => api.put(`/content/categories/${id}`, data),
    deleteFeaturedCategory: (id) => api.delete(`/content/categories/${id}`),
    
    // Blog
    getBlogPosts: () => api.get('/blog'),
};
