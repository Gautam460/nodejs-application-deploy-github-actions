import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import toast from "react-hot-toast";
import { contentApi } from "../../api/content.api";
import Swal from 'sweetalert2';
import { 
  Image as ImageIcon, 
  Menu, 
  Settings, 
  Info, 
  LayoutGrid, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle,
  X,
  FileText
} from 'lucide-react';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [heroSlides, setHeroSlides] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingAbout, setEditingAbout] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);
  const [modalType, setModalType] = useState('hero'); // 'hero', 'about', 'category', 'banner', 'menu'
  const [imageMethod, setImageMethod] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    content: '', // For about section
    name: '', // For category
    slug: '', // For category
    image: '',
    buttonText: '',
    buttonLink: '',
    type: 'content', // For about section: 'hero', 'content', 'value'
    order: 0,
    active: 1,
    position: 'home', // For banner: 'home', 'sidebar', 'top'
    link: '', // For banner
    label: '', // For menu
    url: '', // For menu
    icon: '' // For menu
  });

  // Settings State
  const [settingsData, setSettingsData] = useState({
      siteName: '',
      siteTagline: '',
      phone: '',
      email: '',
      address: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      whatsappNumber: ''
  });

  useEffect(() => {
    if (activeTab === "hero") {
      fetchHeroSlides();
    } else if (activeTab === "about") {
      fetchAboutSections();
    } else if (activeTab === "categories") {
      fetchCategories();
    } else if (activeTab === "banners") {
      fetchBanners();
    } else if (activeTab === "menu") {
      fetchMenuItems();
    } else if (activeTab === "settings") {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
        const response = await contentApi.getSettings();
        if (response.data) {
            setSettingsData(prev => ({...prev, ...response.data}));
        }
    } catch (error) {
        toast.error("Failed to fetch settings");
    } finally {
        setLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
        await contentApi.updateSettings(settingsData);
        toast.success("Settings updated successfully!");
    } catch (error) {
        toast.error("Failed to update settings");
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getMenuItems();
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroSlides = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getHeroSlides();
      if (response.data) {
        setHeroSlides(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  const fetchAboutSections = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getAboutSections();
      if (response.data) {
        setAboutSections(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch about sections");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getFeaturedCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };


  const fetchBanners = async () => {
    setLoading(true);
    try {
      const resHome = await contentApi.getBanners('home');
      const resSidebar = await contentApi.getBanners('sidebar');
      const resTop = await contentApi.getBanners('top');
      const resAbout = await contentApi.getBanners('about');
      const resBlog = await contentApi.getBanners('blog');
      
      let allBanners = [];
      if(resHome.data) allBanners = [...allBanners, ...resHome.data];
      if(resSidebar.data) allBanners = [...allBanners, ...resSidebar.data];
      if(resTop.data) allBanners = [...allBanners, ...resTop.data];
      if(resAbout.data) allBanners = [...allBanners, ...resAbout.data];
      if(resBlog.data) allBanners = [...allBanners, ...resBlog.data];
      
      // Remove duplicates if any (based on id)
      allBanners = Array.from(new Map(allBanners.map(item => [item.id, item])).values());
      
      setBanners(allBanners);
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setImageFile(file);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (modalType === 'hero') {
          if (editingSlide) {
              response = await contentApi.updateHeroSlide(editingSlide.id, formData);
          } else {
              response = await contentApi.createHeroSlide(formData);
          }
      } else if (modalType === 'about') {
          if (editingAbout) {
              response = await contentApi.updateAboutSection(editingAbout.id, formData);
          } else {
              response = await contentApi.createAboutSection(formData);
          }
      } else if (modalType === 'category') {
          if (editingCategory) {
              response = await contentApi.updateFeaturedCategory(editingCategory.id, formData);
          } else {
              response = await contentApi.createFeaturedCategory(formData);
          }
      } else if (modalType === 'banner') {
          if (editingBanner) {
              response = await contentApi.updateBanner(editingBanner.id, formData);
          } else {
              response = await contentApi.createBanner(formData);
          }
      } else if (modalType === 'menu') {
          if (editingMenu) {
              response = await contentApi.updateMenuItem(editingMenu.id, formData);
          } else {
              response = await contentApi.createMenuItem(formData);
          }
      }

      
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success('Saved successfully!');
        setShowModal(false);
        resetForm();
        if (modalType === 'hero') fetchHeroSlides();
        else if (modalType === 'about') fetchAboutSections();
        else if (modalType === 'category') fetchCategories();
        else if (modalType === 'banner') fetchBanners();
        else if (modalType === 'menu') fetchMenuItems();
      } else {
        toast.error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error saving');
    }
  };

  const handleEdit = (item, type = 'hero') => {
    setModalType(type);
    if (type === 'hero') {
        setEditingSlide(item);
        setEditingAbout(null);
        setEditingCategory(null);
        setEditingBanner(null);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            description: item.description || '',
            content: '',
            name: '',
            slug: '',
            image: item.image,
            buttonText: item.buttonText || '',
            buttonLink: item.buttonLink || '',
            type: 'content',
            order: item.order || 0,
            active: item.active
        });
    } else if (type === 'about') {
        setEditingSlide(null);
        setEditingAbout(item);
        setEditingCategory(null);
        setEditingBanner(null);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            description: '',
            content: item.content || '',
            name: '',
            slug: '',
            image: item.image,
            buttonText: '',
            buttonLink: '',
            type: item.type || 'content',
            order: item.order || 0,
            active: item.active
        });
    } else if (type === 'category') {
        setEditingSlide(null);
        setEditingAbout(null);
        setEditingCategory(item);
        setEditingBanner(null);
        setFormData({
            name: item.name,
            slug: item.slug,
            description: item.description || '',
            image: item.image,
            title: '',
            subtitle: '',
            content: '',
            buttonText: '',
            buttonLink: '',
            type: 'content',
            order: item.order || 0,
            active: item.active
        });
    } else if (type === 'banner') {
        setEditingSlide(null);
        setEditingAbout(null);
        setEditingCategory(null);
        setEditingBanner(item);
        setEditingMenu(null);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            image: item.image,
            link: item.link || '',
            position: item.position || 'home',
            order: item.order || 0,
            active: item.active,
            // Reset other fields
            description: '',
            content: '',
            name: '',
            slug: '',
            buttonText: '',
            buttonLink: '',
            type: 'content',
            label: '',
            url: '',
            icon: ''
        });
    } else if (type === 'menu') {
        setEditingSlide(null);
        setEditingAbout(null);
        setEditingCategory(null);
        setEditingBanner(null);
        setEditingMenu(item);
        setFormData({
            label: item.label,
            url: item.url,
            icon: item.icon || '',
            order: item.order || 0,
            active: item.active,
            // Reset others
            title: '',
            subtitle: '',
            description: '',
            content: '',
            name: '',
            slug: '',
            image: '',
            buttonText: '',
            buttonLink: '',
            type: 'content',
            position: 'home',
            link: ''
        });
    }
    
    setImageMethod(item.image && item.image.startsWith('data:image') ? 'upload' : 'url');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id, type = 'hero') => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      let response;
      if (type === 'hero') {
          response = await contentApi.deleteHeroSlide(id);
      } else if (type === 'about') {
          response = await contentApi.deleteAboutSection(id);
      } else if (type === 'category') {
          response = await contentApi.deleteFeaturedCategory(id);
      } else if (type === 'banner') {
          response = await contentApi.deleteBanner(id);
      } else if (type === 'menu') {
          response = await contentApi.deleteMenuItem(id);
      }

      if (response && response.status === 200) {
        toast.success('Deleted successfully!');
        if (type === 'hero') fetchHeroSlides();
        else if (type === 'about') fetchAboutSections();
        else if (type === 'category') fetchCategories();
        else if (type === 'banner') fetchBanners();
        else if (type === 'menu') fetchMenuItems();
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error deleting');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      content: '',
      name: '',
      slug: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      type: 'content',
      order: 0,
      active: 1,
      position: 'home',
      link: '',
      label: '',
      url: '',
      icon: ''
    });
    setEditingSlide(null);
    setEditingAbout(null);
    setEditingCategory(null);
    setEditingBanner(null);
    setEditingMenu(null);
    setImageMethod('url');
    setImageFile(null);
  };

  const handleAddNew = (type = 'hero') => {
    setModalType(type);
    resetForm();
    setShowModal(true);
  };

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <AdminLayout role={user.role} title="Content Management">
      {/* Tab Navigation */}
      <div className="mb-4">
        <ul className="nav nav-pills bg-white rounded-4 shadow-sm p-2">
          <li className="nav-item">
            <button 
              className={`nav-link rounded-3 ${activeTab === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero')}
            >
              <ImageIcon size={16} className="me-2" />Hero Slides
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-3 ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <Menu size={16} className="me-2" />Menu
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-3 ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} className="me-2" />Settings
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-3 ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <Info size={16} className="me-2" />About Us
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-3 ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <LayoutGrid size={16} className="me-2" />Categories
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-3 ${activeTab === 'banners' ? 'active' : ''}`}
              onClick={() => setActiveTab('banners')}
            >
              <ImageIcon size={16} className="me-2" />Banners
            </button>
          </li>
        </ul>
      </div>

      {/* Hero Slides Content */}
      {activeTab === 'hero' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-bold">Hero Slides</h5>
              <p className="mb-0 text-muted small">Manage homepage hero slider</p>
            </div>
            <button className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={handleAddNew}>
              <Plus size={14} />Add New Slide
            </button>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 px-4" style={{fontSize: '12px', fontWeight: '600'}}>Image</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Title</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Subtitle</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Order</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Status</th>
                      <th className="border-0 text-end px-4" style={{fontSize: '12px', fontWeight: '600'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroSlides.length > 0 ? heroSlides.map((slide) => (
                      <tr key={slide.id}>
                        <td className="px-4">
                          <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="rounded" 
                            style={{width: '80px', height: '50px', objectFit: 'cover'}}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/80x50'}
                          />
                        </td>
                        <td className="fw-bold" style={{fontSize: '13px'}}>{slide.title}</td>
                        <td className="text-muted" style={{fontSize: '12px'}}>{slide.subtitle}</td>
                        <td style={{fontSize: '13px'}}>{slide.order}</td>
                        <td>
                          <span className={`badge bg-${slide.active ? 'success' : 'secondary'}`} style={{fontSize: '11px'}}>
                            {slide.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-end px-4">
                          <button 
                            className="btn btn-sm btn-light rounded-circle me-2"
                            onClick={() => handleEdit(slide)}
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                          <button 
                            className="btn btn-sm btn-light rounded-circle text-danger"
                            onClick={() => handleDelete(slide.id)}
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <ImageIcon size={48} className="mb-3 opacity-20" />
                          No slides found. Add your first slide!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* About Sections Content */}
      {activeTab === 'about' && (
         <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                   <h5 className="mb-1 fw-bold">About Sections</h5>
                   <p className="mb-0 text-muted small">Manage content for About Us page</p>
                </div>
                <button className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => handleAddNew('about')}>
                   <Plus size={14} />Add New Section
                </button>
            </div>
            <div className="card-body p-0">
               {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
               ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                           <th className="border-0 px-4" style={{fontSize: '12px', fontWeight: '600'}}>Type</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Image</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Title</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Subtitle</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Order</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Status</th>
                           <th className="border-0 text-end px-4" style={{fontSize: '12px', fontWeight: '600'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aboutSections.length > 0 ? aboutSections.map((section) => (
                           <tr key={section.id}>
                              <td className="px-4">
                                  <span className={`badge ${section.type === 'hero' ? 'bg-primary' : 'bg-info'} bg-opacity-10 text-dark`}>
                                      {section.type ? section.type.toUpperCase() : 'CONTENT'}
                                  </span>
                              </td>
                              <td>
                                {section.image ? (
                                    <div style={{width: '60px', height: '40px'}} className="bg-light rounded d-flex align-items-center justify-content-center overflow-hidden border">
                                        <img 
                                          src={section.image} 
                                          alt={section.title} 
                                          className="w-100 h-100 object-fit-cover"
                                          onError={(e) => {
                                              console.log("Table image failed:", section.image);
                                              e.target.style.display = 'none';
                                          e.target.parentElement.innerHTML = '<div class="text-muted small"><i class="lucide-image"></i></div>';
                                      }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{width: '60px', height: '40px'}} className="bg-light rounded d-flex align-items-center justify-content-center border">
                                        <ImageIcon size={14} className="text-muted" />
                                    </div>
                                )}
                              </td>
                              <td className="fw-bold" style={{fontSize: '13px'}}>{section.title}</td>
                              <td className="text-muted small text-truncate" style={{maxWidth: '150px'}}>{section.subtitle}</td>
                              <td style={{fontSize: '13px'}}>{section.order}</td>
                              <td>
                                <span className={`badge bg-${section.active ? 'success' : 'secondary'}`} style={{fontSize: '11px'}}>
                                  {section.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="text-end px-4">
                                <button 
                                  className="btn btn-sm btn-light rounded-circle me-2"
                                  onClick={() => handleEdit(section, 'about')}
                                  title="Edit"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button 
                                  className="btn btn-sm btn-light rounded-circle text-danger"
                                  onClick={() => handleDelete(section.id, 'about')}
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                           </tr>
                        )) : (
                          <tr>
                             <td colSpan="7" className="text-center py-5 text-muted">
                                <Info size={48} className="mb-3 opacity-20" />
                                No about sections found. Add your first section!
                             </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Categories Content */}
      {activeTab === 'categories' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-bold">Featured Categories</h5>
              <p className="mb-0 text-muted small">Manage categories displayed on About page</p>
            </div>
            <button className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => handleAddNew('category')}>
              <Plus size={14} />Add New Category
            </button>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 px-4" style={{fontSize: '12px', fontWeight: '600'}}>Image</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Name</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Slug</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Description</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Order</th>
                      <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Status</th>
                      <th className="border-0 text-end px-4" style={{fontSize: '12px', fontWeight: '600'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-4">
                          {category.image ? (
                            <div style={{width: '60px', height: '40px'}} className="bg-light rounded d-flex align-items-center justify-content-center overflow-hidden border">
                              <img 
                                src={category.image} 
                                alt={category.name} 
                                className="w-100 h-100 object-fit-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<div class="text-muted small"><i class="lucide-image"></i></div>';
                                }}
                              />
                            </div>
                          ) : (
                            <div style={{width: '60px', height: '40px'}} className="bg-light rounded d-flex align-items-center justify-content-center border">
                              <ImageIcon size={14} className="text-muted" />
                            </div>
                          )}
                        </td>
                        <td className="fw-bold" style={{fontSize: '13px'}}>{category.name}</td>
                        <td className="text-muted small">{category.slug}</td>
                        <td className="text-muted small text-truncate" style={{maxWidth: '200px'}}>{category.description}</td>
                        <td style={{fontSize: '13px'}}>{category.order}</td>
                        <td>
                          <span className={`badge bg-${category.active ? 'success' : 'secondary'}`} style={{fontSize: '11px'}}>
                            {category.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-end px-4">
                          <button 
                            className="btn btn-sm btn-light rounded-circle me-2"
                            onClick={() => handleEdit(category, 'category')}
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                          <button 
                            className="btn btn-sm btn-light rounded-circle text-danger"
                            onClick={() => handleDelete(category.id, 'category')}
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <LayoutGrid size={48} className="mb-3 opacity-20" />
                          No categories found. Add your first category!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banners Content */}
      {activeTab === 'banners' && (
         <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                   <h5 className="mb-1 fw-bold">Banners Management</h5>
                   <p className="mb-0 text-muted small">Manage site banners (Home, Sidebar, Top)</p>
                </div>
                <button className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => handleAddNew('banner')}>
                   <Plus size={14} />Add New Banner
                </button>
            </div>
            <div className="card-body p-0">
               {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
               ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                           <th className="border-0 px-4" style={{fontSize: '12px', fontWeight: '600'}}>Image</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Position</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Title</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Link</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Order</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Status</th>
                           <th className="border-0 text-end px-4" style={{fontSize: '12px', fontWeight: '600'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {banners.length > 0 ? banners.map((banner) => (
                           <tr key={banner.id}>
                              <td className="px-4">
                                  <div style={{width: '60px', height: '40px'}} className="bg-light rounded d-flex align-items-center justify-content-center overflow-hidden border">
                                      {banner.image ? (
                                        <img 
                                          src={banner.image} 
                                          alt={banner.title} 
                                          className="w-100 h-100 object-fit-cover"
                                          onError={(e) => {
                                              e.target.style.display = 'none';
                                          e.target.parentElement.innerHTML = '<div class="text-muted small"><i class="lucide-image"></i></div>';
                                      }}
                                        />
                                      ) : (
                                        <ImageIcon size={14} className="text-muted" />
                                      )}
                                  </div>
                              </td>
                              <td>
                                  <span className={`badge bg-light text-dark border`}>
                                      {banner.position ? banner.position.toUpperCase() : 'HOME'}
                                  </span>
                              </td>
                              <td className="fw-bold" style={{fontSize: '13px'}}>{banner.title || '-'}</td>
                              <td className="text-muted small text-truncate" style={{maxWidth: '150px'}}>{banner.link || '-'}</td>
                              <td style={{fontSize: '13px'}}>{banner.order}</td>
                              <td>
                                <span className={`badge bg-${banner.active ? 'success' : 'secondary'}`} style={{fontSize: '11px'}}>
                                  {banner.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="text-end px-4">
                                <button 
                                  className="btn btn-sm btn-light rounded-circle me-2"
                                  onClick={() => handleEdit(banner, 'banner')}
                                  title="Edit"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button 
                                  className="btn btn-sm btn-light rounded-circle text-danger"
                                  onClick={() => handleDelete(banner.id, 'banner')}
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                           </tr>
                        )) : (
                          <tr>
                             <td colSpan="7" className="text-center py-5 text-muted">
                                <ImageIcon size={48} className="mb-3 opacity-20" />
                                No banners found. Add your first banner!
                             </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Menu Content */}
      {activeTab === 'menu' && (
         <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                   <h5 className="mb-1 fw-bold">Menu Management</h5>
                   <p className="mb-0 text-muted small">Manage website navigation menu</p>
                </div>
                <button className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => handleAddNew('menu')}>
                   <Plus size={14} />Add Menu Item
                </button>
            </div>
            <div className="card-body p-0">
               {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
               ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                           <th className="border-0 px-4" style={{fontSize: '12px', fontWeight: '600'}}>Icon</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Label</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>URL</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Order</th>
                           <th className="border-0" style={{fontSize: '12px', fontWeight: '600'}}>Status</th>
                           <th className="border-0 text-end px-4" style={{fontSize: '12px', fontWeight: '600'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItems.length > 0 ? menuItems.map((item) => (
                           <tr key={item.id}>
                              <td className="px-4">
                                  <div style={{width: '40px', height: '40px'}} className="bg-light rounded-circle d-flex align-items-center justify-content-center border">
                                      {item.icon ? (
                                        <i className={`fa ${item.icon} text-muted`}></i>
                                      ) : (
                                        <Menu size={14} className="text-muted" />
                                      )}
                                  </div>
                              </td>
                              <td className="fw-bold" style={{fontSize: '13px'}}>{item.label}</td>
                              <td className="text-muted small">{item.url}</td>
                              <td style={{fontSize: '13px'}}>{item.order}</td>
                              <td>
                                <span className={`badge bg-${item.active ? 'success' : 'secondary'}`} style={{fontSize: '11px'}}>
                                  {item.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="text-end px-4">
                                <button 
                                  className="btn btn-sm btn-light rounded-circle me-2"
                                  onClick={() => handleEdit(item, 'menu')}
                                  title="Edit"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button 
                                  className="btn btn-sm btn-light rounded-circle text-danger"
                                  onClick={() => handleDelete(item.id, 'menu')}
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                           </tr>
                        )) : (
                          <tr>
                             <td colSpan="6" className="text-center py-5 text-muted">
                                <Menu size={48} className="mb-3 opacity-20" />
                                No menu items found. Add your first item!
                             </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Settings Content */}
      {activeTab === 'settings' && (
         <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom py-3">
               <h5 className="mb-1 fw-bold">Site Settings</h5>
               <p className="mb-0 text-muted small">Manage general website information</p>
            </div>
            <div className="card-body p-4">
               {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
               ) : (
                  <form onSubmit={saveSettings}>
                      <div className="row g-4">
                          <div className="col-12">
                              <h6 className="fw-bold text-primary mb-3">General Information</h6>
                              <div className="row g-3">
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Site Name</label>
                                      <input 
                                          type="text" 
                                          className="form-control" 
                                          name="siteName"
                                          value={settingsData.siteName || ''}
                                          onChange={handleSettingsChange}
                                      />
                                  </div>
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Site Tagline</label>
                                      <input 
                                          type="text" 
                                          className="form-control" 
                                          name="siteTagline"
                                          value={settingsData.siteTagline || ''}
                                          onChange={handleSettingsChange}
                                      />
                                  </div>
                              </div>
                          </div>

                          <div className="col-12">
                              <h6 className="fw-bold text-primary mb-3">Contact Information</h6>
                              <div className="row g-3">
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Phone Number</label>
                                      <input 
                                          type="text" 
                                          className="form-control" 
                                          name="phone"
                                          value={settingsData.phone || ''}
                                          onChange={handleSettingsChange}
                                      />
                                  </div>
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Email Address</label>
                                      <input 
                                          type="email" 
                                          className="form-control" 
                                          name="email"
                                          value={settingsData.email || ''}
                                          onChange={handleSettingsChange}
                                      />
                                  </div>
                                  <div className="col-12">
                                      <label className="form-label fw-bold">Physical Address</label>
                                      <textarea 
                                          className="form-control" 
                                          rows="2"
                                          name="address"
                                          value={settingsData.address || ''}
                                          onChange={handleSettingsChange}
                                      ></textarea>
                                  </div>
                              </div>
                          </div>

                          <div className="col-12">
                              <h6 className="fw-bold text-primary mb-3">Social Media Links</h6>
                              <div className="row g-3">
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Facebook</label>
                                      <div className="input-group">
                                          <span className="input-group-text bg-light"><Facebook size={16} className="text-primary" /></span>
                                          <input 
                                              type="text" 
                                              className="form-control" 
                                              name="facebookUrl"
                                              value={settingsData.facebookUrl || ''}
                                              onChange={handleSettingsChange}
                                              placeholder="https://facebook.com/..."
                                          />
                                      </div>
                                  </div>
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Instagram</label>
                                      <div className="input-group">
                                          <span className="input-group-text bg-light"><Instagram size={16} className="text-danger" /></span>
                                          <input 
                                              type="text" 
                                              className="form-control" 
                                              name="instagramUrl"
                                              value={settingsData.instagramUrl || ''}
                                              onChange={handleSettingsChange}
                                              placeholder="https://instagram.com/..."
                                          />
                                      </div>
                                  </div>
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">Twitter (X)</label>
                                      <div className="input-group">
                                          <span className="input-group-text bg-light"><Twitter size={16} className="text-info" /></span>
                                          <input 
                                              type="text" 
                                              className="form-control" 
                                              name="twitterUrl"
                                              value={settingsData.twitterUrl || ''}
                                              onChange={handleSettingsChange}
                                              placeholder="https://twitter.com/..."
                                          />
                                      </div>
                                  </div>
                                  <div className="col-md-6">
                                      <label className="form-label fw-bold">WhatsApp Number</label>
                                      <div className="input-group">
                                          <span className="input-group-text bg-light"><MessageCircle size={16} className="text-success" /></span>
                                          <input 
                                              type="text" 
                                              className="form-control" 
                                              name="whatsappNumber"
                                              value={settingsData.whatsappNumber || ''}
                                              onChange={handleSettingsChange}
                                              placeholder="+91..."
                                          />
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="col-12 text-end mt-4">
                              <button type="submit" className="btn btn-dark rounded-pill px-5">
                                  <Save size={16} className="me-2" /> Save Settings
                              </button>
                          </div>
                      </div>
                  </form>
               )}
            </div>
         </div>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== 'hero' && activeTab !== 'about' && activeTab !== 'categories' && activeTab !== 'banners' && activeTab !== 'menu' && activeTab !== 'settings' && (
        <div className="alert alert-info">
          <Info size={16} className="me-2" />
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming soon...
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {modalType === 'hero' 
                      ? (editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide')
                      : modalType === 'about'
                      ? (editingAbout ? 'Edit About Section' : 'Add New About Section')
                      : modalType === 'category'
                      ? (editingCategory ? 'Edit Category' : 'Add New Category')
                      : modalType === 'banner'
                      ? (editingBanner ? 'Edit Banner' : 'Add New Banner')
                      : (editingMenu ? 'Edit Menu Item' : 'Add New Menu Item')
                  }
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => { setShowModal(false); resetForm(); }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    
                    {/* Category Fields */}
                    {modalType === 'category' ? (
                      <>
                        <div className="col-12">
                          <label className="form-label fw-bold">Name *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Slug *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., mens-fashion"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Description</label>
                          <textarea 
                            className="form-control" 
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </>
                    ) : modalType === 'menu' ? (
                        <>
                           <div className="col-12">
                               <label className="form-label fw-bold">Label *</label>
                               <input 
                                   type="text" 
                                   className="form-control" 
                                   name="label"
                                   value={formData.label}
                                   onChange={handleInputChange}
                                   required
                               />
                           </div>
                           <div className="col-12">
                               <label className="form-label fw-bold">URL *</label>
                               <input 
                                   type="text" 
                                   className="form-control" 
                                   name="url"
                                   value={formData.url}
                                   onChange={handleInputChange}
                                   required
                                   placeholder="/page"
                               />
                           </div>
                           <div className="col-12">
                               <label className="form-label fw-bold">Icon (FontAwesome)</label>
                               <input 
                                   type="text" 
                                   className="form-control" 
                                   name="icon"
                                   value={formData.icon}
                                   onChange={handleInputChange}
                                   placeholder="fa-home"
                               />
                           </div>
                        </>
                    ) : (
                      <>
                        {/* Hero/About/Banner Fields */}
                        <div className="col-12">
                          <label className="form-label fw-bold">Title *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required={modalType === 'hero'}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Subtitle</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                          />
                        </div>
                      </>
                    )}

                    {/* Banner Specific Fields */}
                    {modalType === 'banner' && (
                        <>
                           <div className="col-md-6">
                               <label className="form-label fw-bold">Position *</label>
                               <select 
                                   className="form-select"
                                   name="position"
                                   value={formData.position || 'home'}
                                   onChange={handleInputChange}
                                   required
                               >
                                   <option value="home">Home (Main Slider/Grid)</option>
                                   <option value="sidebar">Sidebar</option>
                                   <option value="top">Top Bar (Announcement)</option>
                                   <option value="about">About Page Hero</option>
                                   <option value="blog">Blog Page Hero</option>
                               </select>
                           </div>
                           <div className="col-md-6">
                               <label className="form-label fw-bold">Link (URL)</label>
                               <input 
                                   type="text" 
                                   className="form-control" 
                                   name="link"
                                   value={formData.link || ''}
                                   onChange={handleInputChange}
                                   placeholder="/product?sale=true"
                               />
                           </div>
                        </>
                    )}

                    {/* About Section Specific Fields */}
                    {modalType === 'about' && (
                        <>
                           <div className="col-md-6">
                               <label className="form-label fw-bold">Section Type</label>
                               <select 
                                   className="form-select"
                                   name="type"
                                   value={formData.type || 'content'}
                                   onChange={handleInputChange}
                               >
                                   <option value="content">Standard Content</option>
                                   <option value="hero">Page Hero (Top Banner)</option>
                                   <option value="value">Value Prop (Icon)</option>
                               </select>
                           </div>
                           <div className="col-12">
                               <label className="form-label fw-bold">Content (HTML allowed)</label>
                               <textarea 
                                   className="form-control" 
                                   name="content"
                                   rows="5"
                                   value={formData.content}
                                   onChange={handleInputChange}
                               ></textarea>
                           </div>
                        </>
                    )}

                    {/* Hero Slide Specific Fields */}
                    {modalType === 'hero' && (
                        <>
                            <div className="col-12">
                              <label className="form-label fw-bold">Description</label>
                              <textarea 
                                className="form-control" 
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Button Text</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="buttonText"
                                value={formData.buttonText}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Button Link</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="buttonLink"
                                value={formData.buttonLink}
                                onChange={handleInputChange}
                              />
                            </div>
                        </>
                    )}

                    {modalType !== 'menu' && (
                    <div className="col-12">
                      <label className="form-label fw-bold">Image</label>
                      
                      <div className="d-flex gap-3 mb-2">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="imageMethod"
                            checked={imageMethod === 'url'}
                            onChange={() => setImageMethod('url')}
                            id="methodUrl"
                          />
                          <label className="form-check-label" htmlFor="methodUrl">Image URL</label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="imageMethod"
                            checked={imageMethod === 'upload'}
                            onChange={() => setImageMethod('upload')}
                            id="methodUpload"
                          />
                          <label className="form-check-label" htmlFor="methodUpload">Upload Image</label>
                        </div>
                      </div>

                      {imageMethod === 'url' ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          name="image"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input 
                          type="file" 
                          className="form-control" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      )}
                      {formData.image && (
                        <div className="mt-2 p-2 bg-light rounded text-center">
                            <p className="small text-muted mb-1">Preview:</p>
                            <img 
                                src={formData.image} 
                                alt="Preview" 
                                style={{maxHeight: '150px', maxWidth: '100%'}} 
                                className="rounded shadow-sm"
                                onError={(e) => {
                                    console.error("Image preview failed to load:", formData.image);
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                      )}
                    </div>
                    )}

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Display Order</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="col-md-6 d-flex align-items-end">
                      <div className="form-check form-switch mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="active"
                          checked={formData.active === 1}
                          onChange={handleInputChange}
                          id="flexSwitchCheckChecked"
                        />
                        <label className="form-check-label fw-bold" htmlFor="flexSwitchCheckChecked">Active Status</label>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-dark rounded-pill px-4 shadow-sm">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentManagement;
// End of file
