
import api from './axios';

export const roleApi = {
    // Roles
    getAllRoles: () => api.get('/roles'),
    createRole: (data) => api.post('/roles', data),
    updateRole: (id, data) => api.put(`/roles/${id}`, data),
    deleteRole: (id) => api.delete(`/roles/${id}`),

    // Permissions
    getAllPermissions: () => api.get('/permissions'),
    updateRolePermissions: (id, permissionIds) => api.put(`/roles/${id}/permissions`, { permissionIds }),
};
