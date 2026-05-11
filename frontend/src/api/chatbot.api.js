import axios from "./axios";

const API = "/chatbot";

export const chatbotApi = {
  // Admin
  getAll: () => axios.get(`${API}/faqs`),
  create: (data) => axios.post(`${API}/faqs`, data),
  update: (id, data) => axios.put(`${API}/faqs/${id}`, data),
  delete: (id) => axios.delete(`${API}/faqs/${id}`),

  // Public
  getActive: () => axios.get(`${API}/faqs/active`),
  match: (message) => axios.post(`${API}/match`, { message }),
};
