import express from 'express';
import {
  getStockTransactions,
  getProductTransactions,
  stockIn,
  stockOut
} from '../controllers/stockController.js';

const router = express.Router();

router.get('/', getStockTransactions);
router.get('/product/:productId', getProductTransactions);
router.post('/stock-in', stockIn);
router.post('/stock-out', stockOut);

export default router;
