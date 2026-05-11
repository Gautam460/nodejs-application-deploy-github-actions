export enum UserRole {
  SUPER_ADMIN = 'superadmin',
  ADMIN = 'admin',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  WHOLESALE = 'wholesale', // B2B Wholesale Customer
  RESELLER = 'reseller',
  DELIVERY_PARTNER = 'delivery_partner',
  ACCOUNT_MANAGER = 'account_manager',
}

// Helper to get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN: return 'Super Admin';
    case UserRole.ADMIN: return 'Admin';
    case UserRole.VENDOR: return 'Vendor';
    case UserRole.CUSTOMER: return 'Customer';
    case UserRole.WHOLESALE: return 'Wholesale Customer';
    case UserRole.RESELLER: return 'Reseller';
    case UserRole.DELIVERY_PARTNER: return 'Delivery Partner';
    case UserRole.ACCOUNT_MANAGER: return 'Account Manager';
    default: return 'User';
  }
};
