# 🚀 Ultimate Frontend & Backend Implementation Plan

This guide details how to implement the **Advanced B2B/B2C Logic** across the entire stack.

---

## 1. Backend: Role-Based Access Control (RBAC) ✅ (Implemented)

We have moved beyond simple "roles" to **Granular Permissions**.

- **File**: `backend/src/constants/permissions.ts` defines exactly what each role can do.
- **Middleware**: `checkPermission(Permission.VIEW_WHOLESALE_PRICES)` allows precise control.
- **Endpoint**: `GET /api/auth/permissions` returns the logged-in user's capabilities.

### Example Usage (Backend Route)

```typescript
// backend/src/routes/product.routes.ts
router.get(
  "/wholesale-prices",
  authenticate,
  checkPermission(Permission.VIEW_WHOLESALE_PRICES),
  productController.getWholesalePrices,
);
```

---

## 2. Frontend: Smart Architecture (React) 🏗️

To implement "diff diff" (different) views for Wholesale vs Retail, we use a **Permission-Based Routing & Component System**.

### A. Auth Context (`src/context/AuthContext.tsx`)

Fetch and store permissions on login.

```typescript
interface User {
  role: string;
  name: string;
  permissions: string[]; // <--- New Field
}

const login = async (credentials) => {
  const { token, user } = await api.post("/auth/login", credentials);
  // Fetch granular permissions immediately
  const { permissions } = await api.get("/auth/permissions");
  setUser({ ...user, permissions });
};
```

### B. Helper Hook (`usePermission`)

Create a hook to easily check permissions in any component.

```typescript
// src/hooks/usePermission.ts
export const usePermission = (requiredPermission: string) => {
  const { user } = useAuth();
  return (
    user?.permissions?.includes(requiredPermission) ||
    user?.role === "superadmin"
  );
};
```

### C. Smart Components (B2B vs B2C)

Render different prices/buttons based on the user's role.

```typescript
// src/components/ProductCard.tsx
const ProductCard = ({ product }) => {
  const isWholesale = usePermission('view_wholesale_prices');

  return (
    <div className="card">
      <img src={product.image} />
      <h3>{product.title}</h3>

      {/* Retail Price (Always visible or Strikethrough for B2B) */}
      <span className={isWholesale ? "line-through text-gray-500" : "text-xl font-bold"}>
        ₹{product.retailPrice}
      </span>

      {/* Wholesale Price (Only for B2B) */}
      {isWholesale && (
        <div className="bg-yellow-100 p-2 mt-2">
          <span className="text-xl font-bold text-green-700">₹{product.wholesalePrice}</span>
          <p className="text-xs">Min Order: 10 units</p>
        </div>
      )}

      {/* Different Cart Logic */}
      <Button onClick={() => addToCart(product, isWholesale ? 'bulk' : 'retail')}>
        {isWholesale ? 'Add Bulk Order' : 'Add to Cart'}
      </Button>
    </div>
  );
};
```

---

## 3. Dedicated Dashboards (Layout System) 📊

Don't just hide buttons; give them different **homes**.

### Router Setup (`src/App.tsx`)

```typescript
<Routes>
  {/* Public / Retail */}
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
  </Route>

  {/* Reseller Zone */}
  <Route path="/reseller" element={
    <PrivateRoute permission="access_reseller_panel">
      <ResellerLayout />
    </PrivateRoute>
  }>
    <Route index element={<ResellerDashboard />} />
    <Route path="links" element={<AffiliateLinks />} />
  </Route>

  {/* Vendor Portal */}
  <Route path="/vendor" element={
    <PrivateRoute permission="view_vendor_dashboard">
      <VendorLayout />
    </PrivateRoute>
  }>
    <Route index element={<VendorDashboard />} />
    <Route path="products" element={<ProductManager />} />
  </Route>
</Routes>
```

---

## 4. Specific Feature Implementation Ideas 💡

### 🏭 1. Custom Manufacturing Request

- **Frontend**: Create a form at `/b2b/custom-manufacturing`.
- **Fields**: Design File (Upload), Quantity (dropdown: 500, 1000, 5000+), Target Price.
- **Backend Model**: Use `manufacturing_requests` table.
- **Role**: Only users with `request_custom_manufacturing` permission can access.

### 🚚 2. Delivery Partner App

- **View**: Mobile-first view (`/delivery/dashboard`).
- **Feature**: List of assigned orders.
- **Action**: "Scan QR / Enter OTP" button to complete delivery.
- **Permission**: `update_delivery_status`.

### 💰 3. Wallet System

- **Frontend**: `/account/wallet`.
- **Display**: Current Balance (Big Font).
- **History**: Table of transactions (Refunds, Usage).
- **Checkout**: "Pay with Wallet" checkbox if `balance > 0`.

---

## 5. Next Steps for Developer 🛠️

1.  **Run Migrations**: Ensure database has new tables (`npm run migrate`).
2.  **Seed Roles**: Run `GET /api/auth/seed` to create demo users (Admin, Reseller, Wholesale).
3.  **Build Frontend Auth**: Implement the `AuthContext` changes described above.
4.  **Create B2B Layout**: Duplicate main layout but strip distractions and focus on "Bulk Order Form" and "Quick Reorder".
