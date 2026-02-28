import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCategories) // All authenticated users can read
  .post(authorize('Admin', 'Store Manager'), createCategory); // Only Admin & Store Manager

router.route('/:id')
  .get(getCategory) // All authenticated users can read
  .put(authorize('Admin', 'Store Manager'), updateCategory) // Only Admin & Store Manager
  .delete(authorize('Admin', 'Store Manager'), deleteCategory); // Only Admin & Store Manager

export default router;
