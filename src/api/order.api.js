import api from './axios';

export const orderApi = {
    // Custom Orders
    getCustomOrders: () => api.get('/custom-orders'),
    deleteCustomOrder: (id) => api.delete(`/custom-orders/${id}`),
    updateCustomOrderStatus: (id, status) => api.patch(`/custom-orders/${id}/status`, { status }),
    
    // Regular Orders
    getAllOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    deleteOrder: (id) => api.delete(`/orders/${id}`),
};
