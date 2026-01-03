import express from 'express';
import {
  getProducts,
  getProduct,
  getLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';


const router = express.Router();

// Special route for low stock alerts - must come before /:id
router.get('/alerts/low-stock', getLowStockProducts);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
