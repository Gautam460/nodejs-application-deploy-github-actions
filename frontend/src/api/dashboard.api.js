
import api from './axios';

export const dashboardApi = {
    getSuperAdminStats: () => {
        const token = localStorage.getItem('adminToken');
        return api.get('/dashboard/superadmin-stats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};
