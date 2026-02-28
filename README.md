# Inventory & Stock Management System

A modern, full-stack web application for managing products, stock levels, and inventory operations with role-based access control and authentication.

## 🌟 Features Implemented

### Authentication & Authorization ✅
- **HTTP-only Cookie-based Authentication** - Secure token storage using httpOnly cookies
- **JWT Token Management** - JSON Web Tokens for user sessions
- **Password Hashing** - bcrypt for secure password storage (min 6 characters)
- **Login/Logout** - Complete authentication flow

### Role-Based Access Control ✅
Three user roles with different permissions:

| Feature | Admin | Store Manager | Employee |
|---------|:-----:|:-------------:|:--------:|
| **User Management** (CRUD) | ✅ | ❌ | ❌ |
| **Product Create/Update/Delete** | ✅ | ✅ | ❌ |
| **Product Read (+ Low Stock)** | ✅ | ✅ | ✅ |
| **Category/Supplier CRUD** | ✅ | ✅ | ❌ |
| **Stock In/Out Operations** | ✅ | ✅ | ✅ |
| **View Dashboard/Reports** | ✅ | ✅ | ✅ |

### Product Management ✅
- **CRUD Operations** - Create, Read, Update, Delete products
- **Low Stock Alerts** - Automatic detection when stock < minStockLevel
- **Image Upload** - Cloudinary integration for product images
- **Search & Filter** - Search by name, category, or supplier
- **Stock Tracking** - Track quantity and minimum stock levels

### User Management ✅
- **Admin-Only Access** - Only admins can manage users
- **Full CRUD** - Create, read, update, delete users
- **Role Assignment** - Assign Admin, Store Manager, or Employee roles
- **User Status** - Enable/disable user accounts

### Stock Management ✅
- **Stock In/Out** - Record stock transactions
- **Transaction History** - View all stock movements
- **Product-specific History** - Filter transactions by product

### Modern Dark UI ✅
- **Glassmorphism Design** - Backdrop blur effects with transparent cards
- **Gradient Buttons** - Beautiful gradient action buttons
- **Lucide React Icons** - Modern icon library throughout
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Sleek dark mode interface
- **Smooth Animations** - CSS transitions and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (already installed):
```bash
npm install
```

3. Create `.env` file in the backend root directory:
```env
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Configuration (IMPORTANT!)
JWT_SECRET=your_long_random_secret_key_minimum_32_characters
JWT_EXPIRE=24h
JWT_COOKIE_EXPIRE=24

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **Important**: Replace placeholder values with your actual configuration.

4. Start the backend server:
```bash
npm start
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 👤 Creating Admin User

Since user registration is admin-only, you need to create the first admin user manually in MongoDB:

### Option 1: Using MongoDB Compass or Studio 3T
1. Connect to your MongoDB database
2. Find the `users` collection
3. Insert a new document:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "Admin",
  "isActive": true,
  "createdAt": "2026-01-19T00:00:00.000Z",
  "updatedAt": "2026-01-19T00:00:00.000Z"
}
```

### Option 2: Quick Hash Password Script
Create a file `backend/hashPassword.js`:
```javascript
import bcrypt from 'bcryptjs';

const password = 'your_password_here';
bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
});
```

Run: `node backend/hashPassword.js`

Then use the hashed password in MongoDB.

### Option 3: Use MongoDB Shell
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // Use hashed password
  role: "Admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🔐 Default Login Credentials

After creating the admin user as described above, login with:
- **Email**: admin@example.com (or your chosen email)
- **Password**: (the password you used before hashing)

## 📱 Pages & Routes

### Public Routes
- `/login` - Login page

### Protected Routes (All Authenticated Users)
- `/dashboard` - Overview with stats, low stock alerts, recent transactions
- `/products` - View all products
- `/categories` - View categories
- `/suppliers` - View suppliers
- `/stock` - Stock transaction history
- `/products/stock/:id` - Manage stock for a specific product

### Protected Routes (Admin & Store Manager Only)
- `/products/add` - Add new product
- `/products/edit/:id` - Edit product
- Category/Supplier create/edit/delete (inline modals)

### Protected Routes (Admin Only)
- `/users` - User management (CRUD operations)

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT & bcryptjs** - Authentication & password hashing
- **cookie-parser** - Cookie handling
- **Cloudinary** - Image storage
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **Vite** - Build tool

## 📂 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js
│   └── db.js
├── controllers/
│   ├── authController.js       # Login, logout, getMe
│   ├── userController.js       # User CRUD
│   ├── productController.js
│   ├── categoryController.js
│   ├── supplierController.js
│   └── stockController.js
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── authorize.js            # Role-based access
├── models/
│   ├── User.js                 # With bcrypt & JWT methods
│   ├── Product.js
│   ├── Category.js
│   ├── Supplier.js
│   └── StockTransaction.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── supplierRoutes.js
│   ├── stockRoutes.js
│   └── index.js
└── index.js

frontend/
├── src/
│   ├── api/
│   │   └── api.js              # Axios with withCredentials
│   ├── components/
│   │   ├── Navbar.jsx          # Modern navigation
│   │   └── ProtectedRoute.jsx  # Route guard
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── ProductForm.jsx
│   │   ├── Categories.jsx
│   │   ├── Suppliers.jsx
│   │   ├── StockManagement.jsx
│   │   ├── StockHistory.jsx
│   │   └── UserManagement.jsx  # Admin only
│   ├── styles/
│   │   └── index.css           # Tailwind directives
│   ├── App.jsx                 # Routes with protection
│   └── main.jsx
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔒 Security Features

- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ CSRF protection with sameSite: 'strict'
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token expiration (24 hours default)
- ✅ Role-based middleware on backend routes
- ✅ Protected routes on frontend
- ✅ CORS configuration for specific origin

## 🎨 UI Features

- ✅ Dark glassmorphic theme
- ✅ Gradient buttons and cards
- ✅ Smooth animations and transitions
- ✅ Loading states with spinners
- ✅ Empty states with helpful messages
- ✅ Color-coded status badges
- ✅ Responsive grid layouts
- ✅ Mobile-friendly navigation
- ✅ Image previews and upload
- ✅ Modal dialogs

## 📝 API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/password` - Update user password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/alerts/low-stock` - Get low stock products
- `POST /api/products` - Create product (Admin & Store Manager)
- `PUT /api/products/:id` - Update product (Admin & Store Manager)
- `DELETE /api/products/:id` - Delete product (Admin & Store Manager)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin & Store Manager)
- `PUT /api/categories/:id` - Update category (Admin & Store Manager)
- `DELETE /api/categories/:id` - Delete category (Admin & Store Manager)

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier (Admin & Store Manager)
- `PUT /api/suppliers/:id` - Update supplier (Admin & Store Manager)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin & Store Manager)

### Stock Transactions
- `GET /api/stock-transactions` - Get all transactions
- `GET /api/stock-transactions/product/:productId` - Get product transactions
- `POST /api/stock-transactions/stock-in` - Record stock in
- `POST /api/stock-transactions/stock-out` - Record stock out

## 🐛 Troubleshooting

### Can't login / 401 errors
- Make sure `JWT_SECRET` is set in backend `.env`
- Check that backend and frontend are both running
- Clear browser cookies and try again
- Check MongoDB connection

### Images not uploading
- Verify Cloudinary credentials in `.env`
- Check Cloudinary upload preset settings

### CORS errors
- Ensure frontend is running on `http://localhost:5173`
- Check backend CORS configuration in `index.js`

### Cookies not working
- Use the same domain for frontend and backend during development
- Check browser settings (some browsers block third-party cookies)
- Ensure `withCredentials: true` in axios config

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Developed as an Advanced Web Development Mid-Project
