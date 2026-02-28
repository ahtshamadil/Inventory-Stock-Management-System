import express from 'express';
import {
  getProducts,
  getProduct,
  getLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { productValidation } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Special route for low stock alerts - must come before /:id
router.get('/alerts/low-stock', getLowStockProducts);

router.route('/')
  .get(getProducts) // All authenticated users can read
  .post(authorize('Admin', 'Store Manager'), productValidation, createProduct); // Only Admin & Store Manager

router.route('/:id')
  .get(getProduct) // All authenticated users can read
  .put(authorize('Admin', 'Store Manager'), updateProduct) // Only Admin & Store Manager
  .delete(authorize('Admin', 'Store Manager'), deleteProduct); // Only Admin & Store Manager

export default router;
