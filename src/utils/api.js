// API utility to make authenticated requests with JWT token

const API_BASE_URL = '/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('adminToken');
};

// Make authenticated API request
export const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('user');
            localStorage.removeItem('adminUser');
            window.location.href = '/';
            return null;
        }

        return response;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Convenience methods
export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

// Example usage:
// const response = await api.get('/orders');
// const data = await response.json();
