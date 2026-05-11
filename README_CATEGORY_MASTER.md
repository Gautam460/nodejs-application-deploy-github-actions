Category Master (Admin) - Quick Guide
====================================

Overview
--------
This project includes a dynamic Category Master for the admin panel. Super Admins can create hierarchical categories (parent-child), edit, and delete them. Products store category as a slug string and can be filtered by category in the admin UI.

Backend Endpoints
-----------------
All endpoints are registered under /api.

- GET /api/categories
  - Returns active categories (active = 1).

- GET /api/categories/all
  - Returns all categories (including inactive).

- POST /api/categories
  - Create a category. Protected: Super Admin only.
  - Body: { name, slug, description?, parentId?, image?, order?, active? }

- PUT /api/categories/:id
  - Update a category. Protected: Super Admin only.

- DELETE /api/categories/:id
  - Delete a category. Protected: Super Admin only. Fails if the category has child categories.

Frontend (Admin)
----------------
- Admin route: /admin/categories (Super Admin only)
- Create/Edit categories using modal form (name, slug, parent, active).
- Products admin (/admin/products) uses a category dropdown (slug) and product listing can be filtered by category.

Notes & Migration
-----------------
- A `categories` table was added to the backend schema. Categories are intentionally simple (slug used on products) to avoid an intrusive migration on existing `products` table.
- Deleting a category is prevented if it has children. Reassign or remove child categories first.

Next Steps
----------
- Add automated tests for category endpoints (unit/integration) and CI integration.
- Consider migrating `products.category` to a foreign key (`category_id`) in a future release for stricter integrity.

