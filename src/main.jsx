import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
/* Import global custom styles */
import "./assets/css/styles.css";
import "./i18n";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  AiInfo,
  CartCustom,
  NodePage,
  GiftPage,
  Orders,
  Profile,
  Blog,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

// Admin imports
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProfile from "./admin/pages/AdminProfile";
import ContentManagement from "./admin/pages/ContentManagement";
import OrdersPage from "./admin/pages/OrdersPage";
import ProductsPage from "./admin/pages/ProductsPage";
import UsersPage from "./admin/pages/UsersPage";
import RolesPage from "./admin/pages/RolesPage";
import SettingsPage from "./admin/pages/SettingsPage";
import LogsPage from "./admin/pages/LogsPage";
import CustomersPage from "./admin/pages/CustomersPage";
import CustomOrdersPage from "./admin/pages/CustomOrdersPage";
import CategoriesPage from "./admin/pages/CategoriesPage";
import ChatbotFaqsPage from "./admin/pages/ChatbotFaqsPage";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminPlaceholderPage from "./admin/pages/AdminPlaceholderPage";
import MyNetwork from "./admin/pages/reseller/MyNetwork";
import MySales from "./admin/pages/reseller/MySales";
import ResellerPayouts from "./admin/pages/reseller/Payouts";

import InstallPWA from "./components/InstallPWA";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ScrollToTop>
      <Provider store={store}>
        {/* ... Routes ... */}
        <Routes>
          {/* Frontend E-commerce Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/ai-info" element={<AiInfo />} />
          <Route path="/cart-custom" element={<CartCustom />} />
          <Route path="/node" element={<NodePage />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route 
            path="/admin/profile" 
            element={
              <AdminProtectedRoute>
                <AdminProfile />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/content" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <ContentManagement />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin', 'vendor']}>
                <OrdersPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/custom-orders" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <CustomOrdersPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin', 'vendor']}>
                <ProductsPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <UsersPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/roles" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin']}>
                <RolesPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin']}>
                <SettingsPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin']}>
                <CategoriesPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/chatbot-faqs" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <ChatbotFaqsPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin']}>
                <LogsPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/customers" 
            element={
              <AdminProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <CustomersPage />
              </AdminProtectedRoute>
            } 
          />
          
          {/* Vendor Routes */}
          <Route 
            path="/admin/my-products" 
            element={
              <AdminProtectedRoute>
                <ProductsPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/earnings" 
            element={
              <AdminProtectedRoute>
                <AdminPlaceholderPage title="Earnings Dashboard" description="Track your revenue and withdrawal history." />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <AdminProtectedRoute>
                <AdminPlaceholderPage title="Product Reviews" description="Manage and respond to customer reviews." />
              </AdminProtectedRoute>
            } 
          />

          {/* Reseller Routes */}
          <Route 
            path="/admin/network" 
            element={
              <AdminProtectedRoute>
                <AdminPlaceholderPage title="My Network" description="Visualize your reseller network and downlines." />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/sales" 
            element={
              <AdminProtectedRoute>
                <AdminPlaceholderPage title="Sales Reports" description="Analyze sales performance across your network." />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payouts" 
            element={
              <AdminProtectedRoute>
                <AdminPlaceholderPage title="Payouts" description="Manage your commission withdrawals and history." />
              </AdminProtectedRoute>
            } 
          />
          
          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
    <InstallPWA />
  </BrowserRouter>
);
