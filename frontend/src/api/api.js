import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories API
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Suppliers API
export const getSuppliers = () => api.get('/suppliers');
export const getSupplier = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

// Products API
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const getLowStockProducts = () => api.get('/products/alerts/low-stock');
export const createProduct = (data) => {
  console.log('Sending product data:', data);
  return api.post('/products', data);
};
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Stock Transactions API
export const getStockTransactions = () => api.get('/stock-transactions');
export const getProductTransactions = (productId) => api.get(`/stock-transactions/product/${productId}`);
export const stockIn = (data) => api.post('/stock-transactions/stock-in', data);
export const stockOut = (data) => api.post('/stock-transactions/stock-out', data);

export default api;
