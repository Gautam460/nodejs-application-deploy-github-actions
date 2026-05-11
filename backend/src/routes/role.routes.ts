
import express from 'express';
import { getRoles, createRole, updateRole, deleteRole, getPermissions, updateRolePermissions } from '../controllers/role.controller.js';

const router = express.Router();

router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);
router.get('/permissions', getPermissions);
router.put('/roles/:id/permissions', updateRolePermissions);

export default router;
