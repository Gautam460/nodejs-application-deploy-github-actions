import api from './axios';

export const productApi = {
    getAllProducts: () => api.get('/products'),
    getProduct: (id) => api.get(`/products/${id}`),
    getProductsByCategory: (category) => api.get(`/products/category/${category}`),
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};
