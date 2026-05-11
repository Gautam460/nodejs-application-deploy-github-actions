
import api from './axios';

export const resellerApi = {
    getNetwork: (userId) => api.get(`/reseller/network?userId=${userId}`),
    getSales: (userId) => api.get(`/reseller/sales?userId=${userId}`),
    getPayouts: (userId) => api.get(`/reseller/payouts?userId=${userId}`),
    requestPayout: (userId, amount) => api.post('/reseller/payouts', { userId, amount }),
    generateCode: (userId) => api.post('/reseller/generate-code', { userId }),
};
