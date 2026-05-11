import { mysqlTable, serial, varchar, decimal, text, int, timestamp, mediumtext } from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  image: text("image"),
  ratingRate: decimal("rating_rate", { precision: 3, scale: 1 }).default("0"),
  ratingCount: int("rating_count").default(0),
  stock: int("stock").default(0), // For Live Stock Indicator
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("customer"),
  referralCode: varchar("referral_code", { length: 50 }).unique(),
  referredBy: int("referred_by"),
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).default("free"), // 'free', 'premium' (paid)
  subscriptionExpiry: timestamp("subscription_expiry"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("0"), // For B2B Credit System
  isTrusted: int("is_trusted").default(0), // For B2B Trusted Vendors (7 days credit)
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }).default("100"), // Vendor Score
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: text("address").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("Processing"),
  orderType: varchar("order_type", { length: 50 }).default("retail"), // 'retail' or 'wholesale'
  isPickup: int("is_pickup").default(0), // 0 for Delivery, 1 for Pickup
  pickupLocation: varchar("pickup_location", { length: 255 }), // If pickup, which mall/store
  advancePayment: decimal("advance_payment", { precision: 10, scale: 2 }).default("0"), // For B2B
  cancelLimitDate: timestamp("cancel_limit_date"), // For B2B Free Cancellation Window
  deliveryCharge: decimal("delivery_charge", { precision: 10, scale: 2 }).default("0"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  productionStatus: varchar("production_status", { length: 50 }), // For Production Tracking (B2B)
  pickupDate: timestamp("pickup_date"), // For Mall Pickup or Production Ready
  createdAt: timestamp("created_at").defaultNow(),
});

export const canceledOrders = mysqlTable("canceled_orders", {
  id: serial("id").primaryKey(),
  orderId: int("order_id").notNull(),
  reason: text("reason"),
  penaltyAmount: decimal("penalty_amount", { precision: 10, scale: 2 }).default("0"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default("0"),
  status: varchar("status", { length: 50 }).default("Pending"), // Pending, Processed
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: int("order_id").notNull(),
  productId: int("product_id").notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const heroSlides = mysqlTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  text: text("text"),
  image: mediumtext("image").notNull(), // Changed to mediumtext to support Base64 images
  buttonText: varchar("button_text", { length: 100 }).default("Shop Now"),
  buttonLink: varchar("button_link", { length: 255 }).default("/product"),
  active: int("active").default(1),
  order: int("order").default(0),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  image: text("image"),
  category: varchar("category", { length: 100 }),
  date: timestamp("date").defaultNow(),
  author: varchar("author", { length: 255 }).default("Admin"),
});

// New tables for dynamic content

// Site settings (header, footer, general settings)
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 255 }).default("Prince Garments"),
  siteTagline: varchar("site_tagline", { length: 255 }).default("Premium Style"),
  logo: text("logo"),
  favicon: text("favicon"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  facebookUrl: varchar("facebook_url", { length: 255 }),
  instagramUrl: varchar("instagram_url", { length: 255 }),
  twitterUrl: varchar("twitter_url", { length: 255 }),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Navigation menu items (header)
export const menuItems = mysqlTable("menu_items", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 100 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  parentId: int("parent_id").default(0), // For dropdown menus
  order: int("order").default(0),
  active: int("active").default(1),
  icon: varchar("icon", { length: 50 }), // Font awesome icon class
});

// Footer sections
export const footerSections = mysqlTable("footer_sections", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // Can be HTML
  order: int("order").default(0),
  active: int("active").default(1),
});

// Footer links
export const footerLinks = mysqlTable("footer_links", {
  id: serial("id").primaryKey(),
  sectionId: int("section_id").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  order: int("order").default(0),
  active: int("active").default(1),
});

// Homepage sections (features, categories, etc.)
export const homeSections = mysqlTable("home_sections", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'features', 'categories', 'banner', 'testimonials'
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  content: text("content"), // JSON or HTML content
  image: text("image"),
  order: int("order").default(0),
  active: int("active").default(1),
});

// Featured categories
export const featuredCategories = mysqlTable("featured_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  image: mediumtext("image"), // Changed to mediumtext to support larger images
  order: int("order").default(0),
  active: int("active").default(1),
});

// General Categories (Category Master)
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  parentId: int("parent_id").default(0), // 0 for top-level
  image: mediumtext("image"),
  order: int("order").default(0),
  active: int("active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Promotional banners
export const banners = mysqlTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  image: text("image").notNull(),
  link: varchar("link", { length: 255 }),
  position: varchar("position", { length: 50 }).default("home"), // 'home', 'sidebar', 'top'
  order: int("order").default(0),
  active: int("active").default(1),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

// Testimonials
export const testimonials = mysqlTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  designation: varchar("designation", { length: 255 }),
  message: text("message").notNull(),
  image: text("image"),
  rating: int("rating").default(5),
  active: int("active").default(1),
  order: int("order").default(0),
});

// Announcements (top bar)
export const announcements = mysqlTable("announcements", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  link: varchar("link", { length: 255 }),
  backgroundColor: varchar("background_color", { length: 50 }).default("#000000"),
  textColor: varchar("text_color", { length: 50 }).default("#ffffff"),
  active: int("active").default(1),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

// Custom cart fields (for personalization)
export const cartCustomFields = mysqlTable("cart_custom_fields", {
  id: serial("id").primaryKey(),
  fieldName: varchar("field_name", { length: 255 }).notNull(),
  fieldType: varchar("field_type", { length: 50 }).notNull(), // 'text', 'textarea', 'select', 'checkbox'
  fieldLabel: varchar("field_label", { length: 255 }).notNull(),
  fieldPlaceholder: varchar("field_placeholder", { length: 255 }),
  fieldOptions: text("field_options"), // JSON for select options
  required: int("required").default(0),
  order: int("order").default(0),
  active: int("active").default(1),
});

// Returns & Refunds policy
export const returnsPolicies = mysqlTable("returns_policies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // HTML content
  icon: varchar("icon", { length: 50 }), // Font awesome icon
  order: int("order").default(0),
  active: int("active").default(1),
});

// Return requests from customers
export const returnRequests = mysqlTable("return_requests", {
  id: serial("id").primaryKey(),
  orderId: int("order_id").notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("Pending"), // 'Pending', 'Approved', 'Rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Features & Information
export const aiFeatures = mysqlTable("ai_features", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }),
  image: text("image"),
  demoUrl: varchar("demo_url", { length: 255 }),
  order: int("order").default(0),
  active: int("active").default(1),
});

// FAQ for AI Info
export const aiFaqs = mysqlTable("ai_faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  order: int("order").default(0),
  active: int("active").default(1),
});

// Custom Orders (Cart Custom Page)
export const customOrders = mysqlTable("custom_orders", {
  id: serial("id").primaryKey(),
  userId: int("user_id"),
  userEmail: varchar("user_email", { length: 255 }),
  productType: varchar("product_type", { length: 50 }).notNull(), // 'tracksuit', 'shirt', 'pant'
  designPattern: varchar("design_pattern", { length: 50 }),
  fit: varchar("fit", { length: 50 }),
  mainColor: varchar("main_color", { length: 50 }),
  accentColor: varchar("accent_color", { length: 50 }),
  zipperColor: varchar("zipper_color", { length: 50 }),
  hasHood: int("has_hood").default(0),
  hasZipper: int("has_zipper").default(1),
  logoVisible: int("logo_visible").default(1),
  measurements: text("measurements"), // JSON: {shoulder, chest, waist, hips, armLength, inseam, neck}
  customNotes: text("custom_notes"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  designImage: mediumtext("design_image"),
  status: varchar("status", { length: 50 }).default("Pending"), // 'Pending', 'Processing', 'Completed'
  createdAt: timestamp("created_at").defaultNow(),
});

// About us sections
export const aboutSections = mysqlTable("about_sections", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).default("content"), // 'hero', 'content', 'value'
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  content: text("content"),
  image: mediumtext("image"), // Changed to mediumtext to support Base64 images
  order: int("order").default(0),
  active: int("active").default(1),
});

// Access Control
export const roles = mysqlTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(), // e.g., 'superadmin', 'admin'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const permissions = mysqlTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., 'View Users'
  key: varchar("key", { length: 100 }).notNull().unique(), // e.g., 'view_users'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reseller Schema
// To track who referred whom
export const resellerNetwork = mysqlTable("reseller_network", {
  id: serial("id").primaryKey(),
  uplinkId: int("uplink_id").notNull(), // The Reseller (User ID)
  downlinkId: int("downlink_id").notNull(), // The Customer/Sub-reseller (User ID)
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissions = mysqlTable("commissions", {
    id: serial("id").primaryKey(),
    resellerId: int("reseller_id").notNull(), // User ID
    orderId: int("order_id").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).default("Pending"), // Pending, Approved, Paid, Cancelled
    createdAt: timestamp("created_at").defaultNow(),
});

export const payouts = mysqlTable("payouts", {
    id: serial("id").primaryKey(),
    resellerId: int("reseller_id").notNull(), // User ID
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).default("Pending"), // Pending, Processed, Rejected
    method: varchar("method", { length: 50 }).default("Bank Transfer"),
    transactionReference: varchar("transaction_reference", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
});


export const rolePermissions = mysqlTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: int("role_id").notNull(),
  permissionId: int("permission_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Delivery Tracking System
export const deliveries = mysqlTable("deliveries", {
  id: serial("id").primaryKey(),
  orderId: int("order_id").notNull(),
  deliveryPartnerId: int("delivery_partner_id").notNull(), // User ID
  status: varchar("status", { length: 50 }).default("Assigned"), // Assigned, Picked Up, Out for Delivery, Delivered, Failed
  trackingCode: varchar("tracking_code", { length: 100 }),
  proofImage: text("proof_image"), // URL to image
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System Rules (Commission, Penalty, Delivery Rules)
export const systemRules = mysqlTable("system_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., 'delivery_charge_rules', 'penalty_rules', 'commission_config'
  value: text("value").notNull(), // JSON string or simple value
  type: varchar("type", { length: 50 }).default("json"), // 'json', 'string', 'number'
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Power Feature: Reseller Panel Links
export const resellerLinks = mysqlTable("reseller_links", {
  id: serial("id").primaryKey(),
  resellerId: int("reseller_id").notNull(),
  productId: int("product_id").notNull(),
  margin: decimal("margin", { precision: 10, scale: 2 }).default("0"),
  code: varchar("code", { length: 50 }).notNull().unique(), // unique link code
  views: int("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Power Feature: Smart Bulk Pricing
export const productBulkPricing = mysqlTable("product_bulk_pricing", {
  id: serial("id").primaryKey(),
  productId: int("product_id").notNull(),
  minQty: int("min_qty").notNull(),
  maxQty: int("max_qty"), // null means infinite/updates
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// Power Feature: Wallet System
export const wallets = mysqlTable("wallets", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const walletTransactions = mysqlTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  walletId: int("wallet_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'credit', 'debit'
  description: text("description"),
  referenceId: varchar("reference_id", { length: 255 }), // e.g., 'ORDER-123', 'REFUND-456'
  createdAt: timestamp("created_at").defaultNow(),
});

// Advanced Dashboard: Vendor Metrics
export const vendorMetrics = mysqlTable("vendor_metrics", {
  id: serial("id").primaryKey(),
  vendorId: int("vendor_id").notNull(),
  totalOrders: int("total_orders").default(0),
  completedOrders: int("completed_orders").default(0),
  cancelledOrders: int("cancelled_orders").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }).default("0"), // Percentage
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }).default("100"), // 0-100
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Market Differentiator: Custom Manufacturing Requests
export const manufacturingRequests = mysqlTable("manufacturing_requests", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  productType: varchar("product_type", { length: 100 }).notNull(), // e.g., 'Lower', 'T-Shirt'
  quantity: int("quantity").notNull(),
  specifications: text("specifications"), // JSON: fabric, color, sizes
  designFileUrl: text("design_file_url"), // Logo/Design
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default("Requested"), // Requested, Quoted, Accepted, Rejected, In Production, Completed
  vendorId: int("vendor_id"), // Assigned Vendor
  quotedPrice: decimal("quoted_price", { precision: 10, scale: 2 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom Chatbot FAQ / Q&A pairs (admin-managed)
export const chatbotFaqs = mysqlTable("chatbot_faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),        // The full question shown in suggestions
  keywords: text("keywords").notNull(),                            // Comma-separated keywords for matching
  answer: text("answer").notNull(),                               // Bot response
  category: varchar("category", { length: 100 }).default("General"),
  order: int("order").default(0),
  active: int("active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
