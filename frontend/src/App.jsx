import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Lazy-loaded pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const ProductForm = lazy(() => import('./pages/ProductForm'));
const StockManagement = lazy(() => import('./pages/StockManagement'));
const Categories = lazy(() => import('./pages/Categories'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const StockHistory = lazy(() => import('./pages/StockHistory'));
const UserManagement = lazy(() => import('./pages/UserManagement'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AnimatedBackground />
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen">
                        <Navbar />
                        <main>
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            {/* Product Routes - All authenticated users can view */}
                            <Route path="/products" element={<Products />} />

                            {/* Product Create/Edit - Admin & Store Manager only */}
                            <Route
                              path="/products/add"
                              element={
                                <ProtectedRoute roles={['Admin', 'Store Manager']}>
                                  <ProductForm />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/products/edit/:id"
                              element={
                                <ProtectedRoute roles={['Admin', 'Store Manager']}>
                                  <ProductForm />
                                </ProtectedRoute>
                              }
                            />

                            {/* Stock Management - All authenticated users */}
                            <Route path="/products/stock/:id" element={<StockManagement />} />

                            {/* Categories - All authenticated users can view */}
                            <Route path="/categories" element={<Categories />} />

                            {/* Suppliers - All authenticated users can view */}
                            <Route path="/suppliers" element={<Suppliers />} />

                            {/* Stock History - All authenticated users */}
                            <Route path="/stock" element={<StockHistory />} />

                            {/* User Management - Admin only */}
                            <Route
                              path="/users"
                              element={
                                <ProtectedRoute roles={['Admin']}>
                                  <UserManagement />
                                </ProtectedRoute>
                              }
                            />
                          </Routes>
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
