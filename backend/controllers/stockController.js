import StockTransaction from '../models/StockTransaction.js';
import Product from '../models/Product.js';

// @desc    Get all stock transactions
// @route   GET /api/stock-transactions
// @access  Public
const getStockTransactions = async (req, res) => {
  try {
    const transactions = await StockTransaction.find()
      .populate('product', 'name')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stock transactions for a product
// @route   GET /api/stock-transactions/product/:productId
// @access  Public
const getProductTransactions = async (req, res) => {
  try {
    const transactions = await StockTransaction.find({ 
      product: req.params.productId 
    })
      .populate('product', 'name')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create stock in transaction
// @route   POST /api/stock-transactions/stock-in
// @access  Private
const stockIn = async (req, res) => {
  try {
    const { product: productId, quantity, reason } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity + quantity;
    
    // Update product quantity
    product.quantity = newQuantity;
    await product.save();
    
    // Create transaction record
    const transaction = await StockTransaction.create({
      product: productId,
      type: 'in',
      quantity,
      previousQuantity,
      newQuantity,
      reason,
      performedBy: req.body.performedBy // In real app, this would come from auth middleware
    });
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create stock out transaction
// @route   POST /api/stock-transactions/stock-out
// @access  Private
const stockOut = async (req, res) => {
  try {
    const { product: productId, quantity, reason } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
    
    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity - quantity;
    
    // Update product quantity
    product.quantity = newQuantity;
    await product.save();
    
    // Create transaction record
    const transaction = await StockTransaction.create({
      product: productId,
      type: 'out',
      quantity,
      previousQuantity,
      newQuantity,
      reason,
      performedBy: req.body.performedBy // In real app, this would come from auth middleware
    });
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export {
  getStockTransactions,
  getProductTransactions,
  stockIn,
  stockOut
};
