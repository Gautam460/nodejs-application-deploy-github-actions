# Project Architecture

## Overview

A modern, scalable E-commerce application built with React (Frontend) and Node.js/Express (Backend). The application supports multiple user roles including Admin, Customer, Vendor, and Reseller, with a fully responsive mobile-first design.

## Technology Stack

- **Frontend**: React.js, Bootstrap 5, Redux (State Management), React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MySQL (via Drizzle ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS Modules, Custom SCSS, Responsive Design (Inter Font Family)

## Business Model

### 1. **B2B (Wholesale)**

- **Target Audience**: Retailers, Bulk Buyers.
- **Key Features**:
  - Bulk ordering capability.
  - Mall Pickup options.
  - Wholesale pricing tiers.
  - **Smart Payment Logic**:
    - **Order Placement**: 25% Advance Payment required.
    - **Before Production**: Full refund within 2 days cancellation window.
    - **Mid-Production Cancel**: 10% penalty deduction from advance.
    - **Ready Stock Cancel**: 20% penalty deduction from advance.
    - **Delivery**: Remaining 75% payment required before final handover/delivery.

- **Smart System Features**:
  - **Auto Refund System**: Automatically calculates and processes refunds based on cancellation timing.
  - **Auto Penalty**: System deducts 10% or 20% based on order status (Production vs Ready).
  - **Countdown Timer**: Visual timer for the "Free Cancellation" window.

### 2. **B2C (Retail)**

- **Target Audience**: Individual End Customers.
- **Key Features**:
  - Single piece ordering.
  - Standard E-commerce delivery.
  - Wallet integration.
  - Simple checkout process.

### 3. **Delivery Logic (Advanced Model)**

#### **Single Item (B2C) Rules**

- **0–10 km**: Free Delivery.
- **10–20 km**: Paid Delivery (Standard Charge).
- **20+ km**: Delivery Boy Charge System (Dynamic).
- **Timeline**:
  - **Under 20 km**: 5 days delivery.
  - **Outside 20 km**: 15–20 days delivery.

#### **Wholesale (B2B) Rules**

- **Under 20 km**: First 2 deliveries Free.
- **20–100 km**: Chargeable per km/weight.
- **Mall Pickup**: Free option available from listed Mall locations.

## New Power Features 🚀

### 1. **Reseller Panel**

- Set custom margin on products.
- Generate and share unique product links.
- Earn commission on sales through links.

### 2. **Vendor Subscription Plan**

- **Free Plan**: Limited product uploads.
- **Paid Plan**: Unlimited uploads, priority listing.

### 3. **Live Stock Indicator**

- "Only 5 pieces left" alerts.
- Auto-update wholesale bulk prices.

### 4. **Smart Bulk Pricing Table**

- Dynamic pricing tiers (e.g., 1-10: ₹500, 10-50: ₹450, 50+: ₹400).

### 5. **Production Tracking (Unique)**

- Stages: Order Received -> Production Started -> Quality Check -> Ready -> Pickup Date.
- Visual Progress Bar for customers.

### 6. **Credit System for B2B**

- **Trusted Vendors**: 7 days credit system instead of 25% advance.

### 7. **Wallet System**

- Refunds credited to wallet.
- Use wallet balance for future orders.

### 8. **Categories**

- **Men**: Lower, Track Suit, Formal Suit.
- **Women**: Kurti, Western Wear.
- **Kids**.
- **Wholesale Combo Packs**.
- **Clearance Stock**.

## Advanced Admin Dashboard 📊

### 1. **Sales Analytics**

- Separate **B2B (Wholesale)** vs **B2C (Retail)** sales reports.
- **Distance Based Delivery Income**: Track earnings from delivery charges.

### 2. **Operational Reports**

- **Cancellation Analytics**: Reasons and trends (Before/Mid/Ready production).
- **Refund Report**: Auto-refund status and wallet credits.

### 3. **Vendor Metrics**

- **Vendor Performance Score**: Based on order acceptance, production time, and cancellations.

## Market Differentiator: Custom Manufacturing 🏭

**"Your Brand, Our Manufacturing"**

- **Feature**: Customers can request bulk orders (e.g., 500 pieces) with their own custom logo/design.
- **Workflow**:
  1. **Upload Design**: User uploads logo and specifies quantity (e.g., 500 lowers).
  2. **Quote System**: Admin/Vendors provide a price quote.
  3. **Negotiation/Acceptance**: User accepts the quote.
  4. **Production**: Vendor starts manufacturing.

## User Roles

### 1. **Super Admin**

- Full system control
- Commission settings
- **Penalty rules**
- **Delivery rules**
- Vendor approval
- Refund approval
- **Role & Permission Management**

### 2. **Admin**

- Manage orders
- Verify payment screenshots
- Approve products
- Block/Unblock users

### 3. **Vendor**

- Upload products
- Manage stock
- Accept orders
- Update production status

### 4. **Customer (B2C)**

- Single item orders
- Wallet usage
- Cancel orders
- Track delivery

### 5. **Wholesale Customer (B2B Buyer)**

- Bulk orders
- 25% advance payment
- Track production
- Final payment

### 6. **Reseller (Future Ready)**

- Set own margin
- Share referral link
- Earn commission
- Wallet withdrawal

### 7. **Delivery Partner (Advanced System)**

- **Delivery Tracking System**
- View assigned orders
- Pickup confirmation
- **OTP-based delivery verification**
- View earnings report

### 8. **Account Manager (Optional/Future)**

- Handle B2B clients
- Credit approval
- Manage high value orders

## Database Schema (MySQL)

### Users & Auth

- **users**: `id, email, password, name, role (customer, admin, vendor, reseller, superadmin, wholesale, delivery_partner, account_manager), createdAt`
- **roles**: `id, name, description`
- **permissions**: `id, name, key, description`
- **role_permissions**: `id, role_id, permission_id`

### System Configuration (Advanced)

- **system_rules**: `id, name (e.g., penalty_rules), value (json), type, description` (For dynamic rules like commissions, penalties)

### Products & Orders

- **products**: `id, title, price, description, category, image, rating_rate, rating_count, createdAt`
- **orders**: `id, name, email, order_type (retail/wholesale), is_pickup, pickup_location, advance_payment, total_amount, status, createdAt`
- **order_items**: `id, order_id, product_id, quantity, price`
- **custom_orders**: `id, user_id, product_type, design_attributes (json), status`

### Delivery System

- **deliveries**: `id, order_id, delivery_partner_id, status (Assigned, Out for Delivery, Delivered), tracking_code, proof_image, notes`

### Content Management

- **hero_slides**: Homepage hero slider entries.
- **banners**: Promotional banners for various positions.
- **featured_categories**: Highlighted categories on homepage.
- **blog_posts**: News and articles system.
- **site_settings**: Global configuration (Logo, Phone, Social Links).
- **testimonials**: Customer feedback.

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/seed` - Seed demo users

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Vendor)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders & Delivery

- `GET /api/orders` - List all orders (Admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/deliveries/assign` - Assign driver
- `PUT /api/deliveries/:id/status` - Update delivery status (OTP verification)

### Content

- `GET /api/content/slides` - Get hero slides
- `GET /api/content/banners` - Get banners
- `GET /api/content/blog` - Get blog posts

## Deployment Guidance

1. **Database**: Set up a MySQL instance (AWS RDS, DigitalOcean, or local).
2. **Backend**:
   - Set `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` in `.env`.
   - Run `npm install` and `npm start`.
3. **Frontend**:
   - Update API URL in `config.js` or environment.
   - Run `npm run build` to generate static assets.
   - Serve using Nginx, Vercel, or Netlify.

## Upcoming Features (Planned)

- Vendor Dashboard (Earnings & Product Management)
- Reseller Network Graph
- Advanced Coupon System
- **Driver Mobile App (React Native)**
