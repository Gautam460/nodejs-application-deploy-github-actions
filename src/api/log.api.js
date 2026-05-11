
import api from './axios';

export const logApi = {
    getLogs: (date) => api.get(`/logs?date=${date || ''}`),
};
