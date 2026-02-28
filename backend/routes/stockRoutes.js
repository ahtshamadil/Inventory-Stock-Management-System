import express from 'express';
import {
  getStockTransactions,
  getProductTransactions,
  stockIn,
  stockOut
} from '../controllers/stockController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication - all authenticated users can manage stock
router.use(protect);

router.get('/', getStockTransactions);
router.get('/product/:productId', getProductTransactions);
router.post('/stock-in', stockIn);
router.post('/stock-out', stockOut);

export default router;
