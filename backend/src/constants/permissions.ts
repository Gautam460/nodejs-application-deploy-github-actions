
export enum Permission {
  // --- Core E-commerce (B2C) ---
  VIEW_PRODUCTS = 'view_products',
  ADD_TO_CART = 'add_to_cart',
  PLACE_RETAIL_ORDER = 'place_retail_order',
  VIEW_OWN_ORDERS = 'view_own_orders',
  CANCEL_OWN_ORDER = 'cancel_own_order',
  USE_WALLET = 'use_wallet',

  // --- B2B Wholesale Logic ---
  VIEW_WHOLESALE_PRICES = 'view_wholesale_prices',
  PLACE_BULK_ORDER = 'place_bulk_order', // Requires 25% Advance
  REQUEST_CUSTOM_MANUFACTURING = 'request_custom_manufacturing',
  VIEW_PRODUCTION_STATUS = 'view_production_status', // Track Order -> Production -> Ready
  PAY_PARTIAL_PAYMENT = 'pay_partial_payment', // Pay remaining 75%
  ACCESS_CREDIT_SYSTEM = 'access_credit_system', // For Trusted Vendors (7 days credit)

  // --- Reseller Logic ---
  ACCESS_RESELLER_PANEL = 'access_reseller_panel',
  CREATE_AFFILIATE_LINK = 'create_affiliate_link',
  VIEW_COMMISSIONS = 'view_commissions',
  REQUEST_PAYOUT = 'request_payout',

  // --- Vendor Logic ---
  MANAGE_OWN_PRODUCTS = 'manage_own_products',
  VIEW_VENDOR_DASHBOARD = 'view_vendor_dashboard',
  ACCEPT_B2B_ORDER = 'accept_b2b_order',
  UPDATE_PRODUCTION_STATUS = 'update_production_status', // Order Received -> Production -> Ready
  RESPOND_TO_CUSTOM_QUOTE = 'respond_to_custom_quote',
  MANAGE_SUBSCRIPTION = 'manage_subscription',

  // --- Delivery Logic ---
  ACCESS_DELIVERY_APP = 'access_delivery_app',
  VIEW_ASSIGNED_DELIVERIES = 'view_assigned_deliveries',
  UPDATE_DELIVERY_STATUS = 'update_delivery_status', // OTP Verification
  VIEW_DELIVERY_EARNINGS = 'view_delivery_earnings',

  // --- Admin / Super Admin ---
  MANAGE_ALL_USERS = 'manage_all_users',
  MANAGE_ALL_ORDERS = 'manage_all_orders',
  CONFIGURE_SYSTEM_RULES = 'configure_system_rules', // Penalties, Commissions, Delivery Charges
  VIEW_ADVANCED_ANALYTICS = 'view_advanced_analytics', // B2B vs B2C, Vendor Scores
  APPROVE_VENDORS = 'approve_vendors',
  MANAGE_ROLLS_PERMISSIONS = 'manage_roles_permissions',
}

// Map Roles to their Default Permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  customer: [
    Permission.VIEW_PRODUCTS,
    Permission.ADD_TO_CART,
    Permission.PLACE_RETAIL_ORDER,
    Permission.VIEW_OWN_ORDERS,
    Permission.CANCEL_OWN_ORDER,
    Permission.USE_WALLET,
  ],
  wholesale: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_WHOLESALE_PRICES, // Key Differentiator
    Permission.PLACE_BULK_ORDER,
    Permission.VIEW_OWN_ORDERS,
    Permission.CANCEL_OWN_ORDER, // With Penalty Logic
    Permission.VIEW_PRODUCTION_STATUS,
    Permission.PAY_PARTIAL_PAYMENT,
    Permission.REQUEST_CUSTOM_MANUFACTURING,
  ],
  reseller: [
    Permission.VIEW_PRODUCTS,
    Permission.ACCESS_RESELLER_PANEL, // Key Differentiator
    Permission.CREATE_AFFILIATE_LINK,
    Permission.VIEW_COMMISSIONS,
    Permission.REQUEST_PAYOUT,
    Permission.PLACE_RETAIL_ORDER, // Can also buy for self
  ],
  vendor: [
    Permission.MANAGE_OWN_PRODUCTS,
    Permission.VIEW_VENDOR_DASHBOARD,
    Permission.ACCEPT_B2B_ORDER,
    Permission.UPDATE_PRODUCTION_STATUS,
    Permission.RESPOND_TO_CUSTOM_QUOTE,
    Permission.MANAGE_SUBSCRIPTION,
  ],
  delivery_partner: [
    Permission.ACCESS_DELIVERY_APP,
    Permission.VIEW_ASSIGNED_DELIVERIES,
    Permission.UPDATE_DELIVERY_STATUS,
    Permission.VIEW_DELIVERY_EARNINGS,
  ],
  admin: [
    Permission.MANAGE_ALL_USERS,
    Permission.MANAGE_ALL_ORDERS,
    Permission.APPROVE_VENDORS,
    Permission.VIEW_ADVANCED_ANALYTICS,
  ],
  superadmin: Object.values(Permission), // Full Access
};
