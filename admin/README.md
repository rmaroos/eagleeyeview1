# Eagle Eye View — Standalone Admin Management Suite

A dedicated, enterprise-grade administrative dashboard built for **Eagle Eye View** to manage catalog products, orders, categories, customer CRM, and inventory stock.

---

## 🌟 Key Features

1. **📊 Executive Dashboard**:
   - Total Revenue, Order counts, Active product statistics, and Low Stock Alerts.
   - Interactive SVG Sales & Revenue Trends Chart (7 days, 30 days, 12 months).
   - Recent customer orders stream and top-performing products leaderboard.

2. **📦 Product Management (Full CRUD)**:
   - Add, edit, duplicate, and delete products.
   - Dual department support: **Electronics** (with technical specs and key spec tags) & **Fashion** (with materials, dimensions, closures, and custom color swatches).
   - Multi-image gallery with live preview.
   - Badges: `BEST SELLER`, `NEW ARRIVAL`, `SALE`, `FEATURED`.

3. **🚚 Order Fulfillment & CRM**:
   - Filter orders by fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
   - Payment status tracking (`Paid`, `Unpaid`, `Refunded`).
   - Courier tracking number entry.
   - Full order breakdown: customer details, shipping address, line items, and invoice printing.

4. **📂 Category & Department Management**:
   - Manage Electronics and Fashion categories.
   - Subcategories creator and tag organizer.

5. **📦 Rapid Inventory Restocker**:
   - Bulk inventory evaluation and stock valuation (LKR).
   - Quick `+5`, `+10`, `+25` restock buttons with instant saving.

6. **⚡ Supabase Database Synchronization**:
   - Connects seamlessly to a shared Supabase PostgreSQL backend.
   - Included production-ready SQL Schema (`supabase_schema.sql`).
   - Integrated connection tester in the admin interface.

---

## 🚀 Running the Admin Panel Locally

### Option 1: From the Project Root
```bash
npm run admin:dev
```

### Option 2: From the `admin/` Directory
```bash
cd admin
npm run dev
```

The admin portal will start on: **`http://localhost:5174`**
(Customer storefront runs concurrently on `http://localhost:5173`).

---

## 🛠️ Build for Production Deployment

To build a standalone production bundle for deployment (e.g. to `admin.eagleeyeview.lk` on Vercel, Netlify, or Cloudflare):
```bash
cd admin
npm run build
```
The output directory will be `admin/dist`.
