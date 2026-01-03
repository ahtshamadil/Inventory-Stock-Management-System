import Product from "../models/Product.js";
import cloudinary from '../config/cloudinary.js';


//  Get all products
//  GET /api/products

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("supplier", "name email");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//   Get single product
// GET /api/products/:id

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name description")
      .populate("supplier", "name email phone");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get low stock products
// GET /api/products/alerts/low-stock

const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("supplier", "name email");

    const lowStockProducts = products.filter((product) => product.isLowStock);

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//   Create new product
//  POST /api/products

const createProduct = async (req, res) => {
  try {
    let imageUrl = null;
    let imagePublicId = null;
    // Only support base64 image upload
    if (req.body.imageBase64) {
      try {
        const result = await cloudinary.uploader.upload(req.body.imageBase64, {
          folder: 'products',
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(400).json({ success: false, message: 'Cloudinary upload failed', error: cloudErr.message });
      }
    }

    const productData = { ...req.body };
    if (imageUrl) productData.image = imageUrl;
    if (imagePublicId) productData.imagePublicId = imagePublicId;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

//  Update product
//  PUT /api/products/:id

const updateProduct = async (req, res) => {
  try {
    // First, get the existing product to check for old image
    const existingProduct = await Product.findById(req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let imageUrl = existingProduct.image;
    let imagePublicId = existingProduct.imagePublicId;

    // Handle image removal if empty string is sent
    if (req.body.imageBase64 === '') {
      // Delete old image from Cloudinary if it exists
      if (existingProduct.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.imagePublicId);
        } catch (cloudErr) {
          // Continue even if deletion fails
        }
      }
      imageUrl = null;
      imagePublicId = null;
    }
    // Handle image update if new image is provided
    else if (req.body.imageBase64) {
      // Delete old image from Cloudinary if it exists
      if (existingProduct.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.imagePublicId);
        } catch (cloudErr) {
          console.error('Error deleting old image from Cloudinary:', cloudErr);
          // Continue even if deletion fails
        }
      }

      // Upload new image
      try {
        const result = await cloudinary.uploader.upload(req.body.imageBase64, {
          folder: 'products',
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(400).json({ 
          success: false, 
          message: 'Cloudinary upload failed', 
          error: cloudErr.message 
        });
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    // Always set image and imagePublicId (even if null to remove them)
    updateData.image = imageUrl || null;
    updateData.imagePublicId = imagePublicId || null;
    // Remove imageBase64 from update data as it's not a schema field
    delete updateData.imageBase64;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//    Delete product
//   DELETE /api/products/:id

const deleteProduct = async (req, res) => {
  try {
    // First, get the product to check for image
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (cloudErr) {
        console.error('Error deleting image from Cloudinary:', cloudErr);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getProducts,
  getProduct,
  getLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
