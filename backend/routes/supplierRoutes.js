import express from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getSuppliers) // All authenticated users can read
  .post(authorize('Admin', 'Store Manager'), createSupplier); // Only Admin & Store Manager

router.route('/:id')
  .get(getSupplier) // All authenticated users can read
  .put(authorize('Admin', 'Store Manager'), updateSupplier) // Only Admin & Store Manager
  .delete(authorize('Admin', 'Store Manager'), deleteSupplier); // Only Admin & Store Manager

export default router;
