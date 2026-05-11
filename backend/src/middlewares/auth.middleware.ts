import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Base authentication middleware - verifies JWT token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Role-based middleware
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied. Insufficient permissions.',
                requiredRoles: roles,
                yourRole: req.user.role
            });
        }

        next();
    };
};

import { UserRole } from '../constants/roles.js';
import { Permission, ROLE_PERMISSIONS } from '../constants/permissions.js';

// Specific role middlewares for convenience
export const isSuperAdmin = authorizeRoles(UserRole.SUPER_ADMIN);
export const isAdmin = authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN);
export const isVendor = authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR);
export const isReseller = authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RESELLER);
export const isWholesaleCustomer = authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.WHOLESALE);
export const isDeliveryPartner = authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DELIVERY_PARTNER);
export const isAccountManager = authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER);
export const isCustomer = authorizeRoles(UserRole.CUSTOMER);

// Permission-based middleware (More granular control)
export const checkPermission = (requiredPermission: Permission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userRole = req.user.role;
        const userPermissions = ROLE_PERMISSIONS[userRole] || [];

        if (userRole === UserRole.SUPER_ADMIN || userPermissions.includes(requiredPermission)) {
             next();
        } else {
            return res.status(403).json({ 
                error: 'Access denied. Insufficient permissions.',
                requiredPermission: requiredPermission,
                yourRole: userRole
            });
        }
    };
};

// Allow any authenticated user
export const isAnyUser = authorizeRoles(
    UserRole.SUPER_ADMIN, 
    UserRole.ADMIN, 
    UserRole.VENDOR, 
    UserRole.RESELLER, 
    UserRole.WHOLESALE, 
    UserRole.DELIVERY_PARTNER, 
    UserRole.ACCOUNT_MANAGER, 
    UserRole.CUSTOMER
);

// Generate JWT token
export const generateToken = (user: any) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            name: user.name 
        },
        JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
};
