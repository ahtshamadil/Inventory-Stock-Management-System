<p align="center">
  <h1 align="center">📦 NexStock — Inventory & Stock Management</h1>
  <p align="center">
    A production-ready, full-stack inventory management platform built with the MERN stack. Features role-based access control, real-time stock tracking, interactive analytics dashboards, and a modern glassmorphic dark UI.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Creating the Admin User](#creating-the-admin-user)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Role-Based Access Control](#role-based-access-control)
- [Security](#security)
- [Performance Optimizations](#performance-optimizations)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

**NexStock** is an enterprise-grade web application designed to help businesses manage their product inventory, track stock movements, monitor low-stock alerts, and generate analytics — all through an intuitive, modern interface.

Built with a decoupled architecture (React SPA + Express REST API), the system supports three user roles with granular permission control, ensuring secure access at every level.

---

## Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookie storage
- Secure password hashing with bcrypt (10 salt rounds)
- Auto session validation on app load via `/auth/me`
- Role-based route guards on both frontend and backend

### 📊 Interactive Dashboard
- Real-time statistics: total products, low-stock alerts, transaction count, inventory value
- **4 interactive charts** (Chart.js): stock levels, category distribution, transaction trends, inventory value by category
- Animated counters and staggered card animations
- Quick links to low-stock items and recent transactions

### 📦 Product Management
- Full CRUD with server-side pagination and search
- Image upload via Cloudinary (with automatic optimization)
- Low-stock detection using `quantity ≤ minStockLevel`
- Category and supplier association with populated references

### 📈 Stock Operations
- Stock-in / Stock-out recording with reason tracking
- Full transaction history with pagination and date filtering
- Per-product transaction view
- Previous/new quantity audit trail

### 👥 User Management (Admin Only)
- Create, update, delete, and deactivate user accounts
- Role assignment: Admin, Store Manager, Employee
- Password management with dedicated endpoint

### 🏷️ Categories & Suppliers
- CRUD operations for product categories and suppliers
- Supplier contact info (email, phone, address)
- Inline modal-based create/edit UI

### 🎨 Modern UI/UX
- **Dark glassmorphic theme** with backdrop-blur effects
- **Framer Motion** page transitions and stagger animations
- **CSS-only animated background** orbs (GPU-composited)
- **Skeleton loaders** for perceived performance
- Fully responsive (mobile, tablet, desktop)
- Lucide React icon system throughout

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | Component-based UI library |
| **Vite 7** | Next-gen build tool with HMR |
| **React Router DOM 7** | Client-side routing |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Axios** | HTTP client with interceptors |
| **Chart.js + react-chartjs-2** | Interactive charts and analytics |
| **Framer Motion** | Page transitions and UI animations |
| **Lucide React** | Modern icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| **Express 5** | Web framework |
| **Mongoose 9** | MongoDB ODM with schema validation |
| **JSON Web Token** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Cloudinary SDK** | Image upload and optimization |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | API rate limiting |
| **compression** | Gzip response compression |
| **express-validator** | Request validation middleware |
| **cookie-parser** | HTTP cookie handling |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database (free M0 tier) |
| **Cloudinary** | Image CDN and transformation |
| **Render** | Backend hosting (free tier) |
| **Vercel** | Frontend hosting (free tier) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React SPA)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Pages   │  │Components│  │ Context  │  │  API   │  │
│  │(10 pages)│  │(9 comps) │  │Auth/Toast│  │(Axios) │  │
│  └──────────┘  └──────────┘  └──────────┘  └───┬────┘  │
│                   React Router (code-split)     │       │
└─────────────────────────────────────────────────┼───────┘
                 HTTP (JSON) + Cookies            │
┌─────────────────────────────────────────────────┼───────┐
│                    SERVER (Express 5)            │       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───┴────┐  │
│  │  Routes  │  │Middleware│  │Controllers│  │ Models │  │
│  │(7 files) │  │Auth/RBAC │  │(6 files)  │  │(5 ODM) │  │
│  └──────────┘  └──────────┘  └──────────┘  └───┬────┘  │
│  Helmet │ CORS │ Rate Limit │ Compression      │       │
└─────────────────────────────────────────────────┼───────┘
                       Mongoose ODM               │
┌─────────────────────────────────────────────────┼───────┐
│              MongoDB Atlas (M0 Cluster)         │       │
│  ┌──────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ │       │
│  │Users │ │Products│ │Categories│ │Suppliers │ │       │
│  └──────┘ └────────┘ └──────────┘ └──────────┘ │       │
│  ┌─────────────────┐                           │       │
│  │StockTransactions│  (Indexed Collections)    │       │
│  └─────────────────┘                           │       │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Cloudinary** account — [sign up free](https://cloudinary.com)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/ahtshamadil/Inventory-Stock-Management-System.git
cd Inventory-Stock-Management-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)).

```bash
# Development
npm run dev

# Production
npm start
```

The API server starts at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Optionally create a `.env` file in `frontend/` (defaults to `http://localhost:3000/api`):

```env
VITE_API_URL=http://localhost:3000/api
```

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

The frontend starts at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `MONGO_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRE` | No | `24h` | Token expiration time |
| `JWT_COOKIE_EXPIRE` | No | `24` | Cookie expiration in hours |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **Yes** | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **Yes** | — | Cloudinary API secret |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend origin for CORS |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:3000/api` | Backend API base URL |

> ⚠️ **Security**: Never commit `.env` files. Both are already in `.gitignore`.

---

## Creating the Admin User

Since registration defaults to the `Employee` role, you need to create the first Admin user manually.

### Option 1: Use the Built-in Script

```bash
cd backend
node createAdmin.js
```

This will create an admin with predefined credentials (check the script for details).

### Option 2: Register and Promote via MongoDB

1. Register a user normally via the `/signup` page
2. Open **MongoDB Compass** or the **Atlas UI**
3. Find your user in the `users` collection
4. Change the `role` field from `"Employee"` to `"Admin"`

### Option 3: MongoDB Shell

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "Admin" } }
)
```

---

## Project Structure

```
Inventory-Stock-Management-System/
│
├── backend/                          # Express REST API
│   ├── config/
│   │   ├── cloudinary.js             # Cloudinary SDK configuration
│   │   └── db.js                     # MongoDB connection handler
│   │
│   ├── controllers/
│   │   ├── authController.js         # Login, register, logout, getMe
│   │   ├── categoryController.js     # Category CRUD
│   │   ├── productController.js      # Product CRUD + low-stock query
│   │   ├── stockController.js        # Stock in/out + transaction history
│   │   ├── supplierController.js     # Supplier CRUD
│   │   └── userController.js         # User CRUD (admin only)
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification from cookies
│   │   ├── authorize.js              # Role-based access control
│   │   ├── errorHandler.js           # Global error handler
│   │   └── validation.js             # Request validation rules
│   │
│   ├── models/
│   │   ├── Category.js               # Category schema
│   │   ├── Product.js                # Product schema with indexes
│   │   ├── StockTransaction.js       # Transaction schema with indexes
│   │   ├── Supplier.js               # Supplier schema
│   │   └── User.js                   # User schema with JWT + bcrypt
│   │
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth/*
│   │   ├── categoryRoutes.js         # /api/categories/*
│   │   ├── index.js                  # Route aggregator
│   │   ├── productRoutes.js          # /api/products/*
│   │   ├── stockRoutes.js            # /api/stock-transactions/*
│   │   ├── supplierRoutes.js         # /api/suppliers/*
│   │   └── userRoutes.js             # /api/users/*
│   │
│   ├── createAdmin.js                # Admin user seeding script
│   ├── index.js                      # App entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                         # React SPA (Vite)
│   ├── public/                       # Static assets
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                # Axios instance + all API functions
│   │   │
│   │   ├── components/
│   │   │   ├── AnimatedBackground.jsx  # CSS-animated gradient orbs
│   │   │   ├── Animations.jsx          # Reusable motion components
│   │   │   ├── Charts.jsx              # Chart.js chart components
│   │   │   ├── ConfirmModal.jsx        # Delete confirmation dialog
│   │   │   ├── ErrorBoundary.jsx       # React error boundary
│   │   │   ├── Loader.jsx              # Loading spinner
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── ProtectedRoute.jsx      # Auth + role route guard
│   │   │   └── Skeleton.jsx            # Skeleton loading placeholders
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Authentication state provider
│   │   │   └── ToastContext.jsx        # Toast notification provider
│   │   │
│   │   ├── pages/
│   │   │   ├── Categories.jsx          # Category management
│   │   │   ├── Dashboard.jsx           # Analytics dashboard
│   │   │   ├── Login.jsx               # Login form
│   │   │   ├── ProductForm.jsx         # Add/edit product form
│   │   │   ├── Products.jsx            # Product listing with pagination
│   │   │   ├── Signup.jsx              # User registration
│   │   │   ├── StockHistory.jsx        # Transaction history
│   │   │   ├── StockManagement.jsx     # Stock in/out operations
│   │   │   ├── Suppliers.jsx           # Supplier management
│   │   │   └── UserManagement.jsx      # User CRUD (admin only)
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css               # Tailwind directives + custom styles
│   │   │   ├── Dashboard.css
│   │   │   ├── Products.css
│   │   │   ├── ProductForm.css
│   │   │   ├── StockManagement.css
│   │   │   ├── Navbar.css
│   │   │   └── App.css
│   │   │
│   │   ├── App.jsx                     # Root component with routing
│   │   └── main.jsx                    # React app entry point
│   │
│   ├── index.html                      # HTML template
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## API Reference

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register new user (default: Employee role) |
| `POST` | `/auth/login` | Public | Login and receive JWT cookie |
| `POST` | `/auth/logout` | Private | Clear auth cookie |
| `GET` | `/auth/me` | Private | Get current authenticated user |

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/users` | Admin | List all users |
| `GET` | `/users/:id` | Admin | Get user by ID |
| `POST` | `/users` | Admin | Create new user |
| `PUT` | `/users/:id` | Admin | Update user details |
| `DELETE` | `/users/:id` | Admin | Delete user |
| `PUT` | `/users/:id/password` | Admin | Change user password |

### Products

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/products` | Private | List products (paginated) |
| `GET` | `/products/:id` | Private | Get product details |
| `GET` | `/products/alerts/low-stock` | Private | Get low-stock products |
| `POST` | `/products` | Admin, Manager | Create product |
| `PUT` | `/products/:id` | Admin, Manager | Update product |
| `DELETE` | `/products/:id` | Admin, Manager | Delete product |

**Query parameters for `GET /products`:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `search` | string | — | Search by product name |
| `category` | ObjectId | — | Filter by category ID |
| `supplier` | ObjectId | — | Filter by supplier ID |

### Categories

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/categories` | Private | List all categories |
| `GET` | `/categories/:id` | Private | Get category by ID |
| `POST` | `/categories` | Admin, Manager | Create category |
| `PUT` | `/categories/:id` | Admin, Manager | Update category |
| `DELETE` | `/categories/:id` | Admin, Manager | Delete category |

### Suppliers

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/suppliers` | Private | List all suppliers |
| `GET` | `/suppliers/:id` | Private | Get supplier by ID |
| `POST` | `/suppliers` | Admin, Manager | Create supplier |
| `PUT` | `/suppliers/:id` | Admin, Manager | Update supplier |
| `DELETE` | `/suppliers/:id` | Admin, Manager | Delete supplier |

### Stock Transactions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/stock-transactions` | Private | List transactions (paginated) |
| `GET` | `/stock-transactions/product/:id` | Private | Transactions for a product |
| `POST` | `/stock-transactions/stock-in` | Private | Record stock-in |
| `POST` | `/stock-transactions/stock-out` | Private | Record stock-out |

**Query parameters for `GET /stock-transactions`:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `50` | Items per page |
| `days` | number | — | Filter last N days |

---

## Role-Based Access Control

The system implements three-tier access control enforced on both the API and UI layers.

| Capability | Admin | Store Manager | Employee |
|------------|:-----:|:-------------:|:--------:|
| View Dashboard & Charts | ✅ | ✅ | ✅ |
| View Products / Categories / Suppliers | ✅ | ✅ | ✅ |
| Stock In / Stock Out | ✅ | ✅ | ✅ |
| View Stock History | ✅ | ✅ | ✅ |
| Create / Edit / Delete Products | ✅ | ✅ | ❌ |
| Manage Categories & Suppliers | ✅ | ✅ | ❌ |
| User Management (CRUD) | ✅ | ❌ | ❌ |
| Assign Roles | ✅ | ❌ | ❌ |
| Activate / Deactivate Users | ✅ | ❌ | ❌ |

---

## Security

| Feature | Implementation |
|---------|----------------|
| **Authentication** | JWT stored in HTTP-only cookies (not accessible via JS) |
| **Password Storage** | bcrypt hashing with 10 salt rounds |
| **CSRF Protection** | `sameSite: lax` (dev) / `sameSite: none` + `secure: true` (prod) |
| **HTTP Headers** | Helmet.js for security headers (X-Frame-Options, CSP, etc.) |
| **Rate Limiting** | 300 req/15min (general), 10 req/15min (auth endpoints) |
| **Input Validation** | express-validator on all mutation endpoints |
| **CORS** | Restricted to configured frontend origin |
| **Error Handling** | Global error handler — no stack traces leaked in production |

---

## Performance Optimizations

| Optimization | Impact |
|-------------|--------|
| **Code Splitting** | `React.lazy()` + `Suspense` — each page loaded on demand |
| **MongoDB Indexes** | Compound indexes on Product (name, category, supplier, createdAt, quantity) and StockTransaction (product, createdAt, type) |
| **DB-Level Filtering** | Low-stock query uses `$expr` instead of JS-side filtering |
| **Paginated APIs** | Products and transactions support server-side pagination |
| **Gzip Compression** | `compression` middleware reduces response size by 60–80% |
| **Lazy Image Loading** | `loading="lazy"` on all product images |
| **CSS Animations** | Background orbs use CSS `@keyframes` instead of JS runtime |
| **Non-blocking Font** | Google Fonts loaded with `media="print"` swap technique |
| **Skeleton Loaders** | Perceived performance while data loads |

---

## Deployment

The app can be deployed **100% free** using:

| Component | Service | Tier |
|-----------|---------|------|
| Frontend | [Vercel](https://vercel.com) | Free |
| Backend | [Render](https://render.com) | Free |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) | Free (M0) |
| Images | [Cloudinary](https://cloudinary.com) | Free |

### Quick Deploy Steps

1. **Push to GitHub** (if not already done)
2. **Backend → Render**: New Web Service → Root Directory: `backend` → Build: `npm install` → Start: `npm start` → Add env vars
3. **Frontend → Vercel**: Import repo → Root Directory: `frontend` → Add `VITE_API_URL` env var pointing to Render URL
4. **Update Render** `FRONTEND_URL` env var with your Vercel URL
5. **MongoDB Atlas**: Ensure Network Access allows `0.0.0.0/0`

> **Note**: Render's free tier spins down after 15 minutes of inactivity. First request after idle takes ~30-50s to cold-start.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **401 Unauthorized** | Ensure `JWT_SECRET` is set. Clear cookies and re-login. |
| **CORS errors** | Verify `FRONTEND_URL` in backend matches your frontend origin exactly (no trailing `/`). |
| **Images not uploading** | Check Cloudinary credentials in `.env`. Ensure `express.json({ limit: '50mb' })` is set. |
| **Cookies not sent** | Ensure `withCredentials: true` in Axios. Check `sameSite` / `secure` cookie settings. |
| **Slow first load (prod)** | Normal for Render free tier. The server cold-starts after 15min idle. |
| **MongoDB connection fails** | Check `MONGO_URI` format. Ensure Atlas Network Access includes your IP or `0.0.0.0/0`. |
| **Rate limit hit** | Default is 300 req/15min. Adjust `generalLimiter` in `backend/index.js`. |

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Author

**Ahtsham Adil**

Built as an Advanced Web Development project — demonstrating full-stack MERN development with enterprise patterns including RBAC, JWT auth, cloud image hosting, and production deployment.

---

<p align="center">
  <sub>If you found this useful, consider giving it a ⭐</sub>
</p>
