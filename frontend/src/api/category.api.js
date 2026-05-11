import api from "./axios";

export const categoryApi = {
  getActiveCategories: () => api.get("/categories"),
  getAllCategories: () => api.get("/categories/all"),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

