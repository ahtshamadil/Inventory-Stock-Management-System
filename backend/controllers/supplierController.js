import Supplier from '../models/Supplier.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Public
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = async (req, res) => {
  try {
    let imageUrl = null;
    let imagePublicId = null;
    
    // Handle base64 image upload
    if (req.body.imageBase64) {
      try {
        const result = await cloudinary.uploader.upload(req.body.imageBase64, {
          folder: 'suppliers',
          quality: 'auto:best',
          fetch_format: 'auto'
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(400).json({ success: false, message: 'Image upload failed', error: cloudErr.message });
      }
    }
    
    const supplierData = { ...req.body };
    if (imageUrl) supplierData.image = imageUrl;
    if (imagePublicId) supplierData.imagePublicId = imagePublicId;
    delete supplierData.imageBase64;
    
    const supplier = await Supplier.create(supplierData);
    
    res.status(201).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = async (req, res) => {
  try {
    const existingSupplier = await Supplier.findById(req.params.id);
    
    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    
    let imageUrl = existingSupplier.image;
    let imagePublicId = existingSupplier.imagePublicId;
    
    // Handle new image upload
    if (req.body.imageBase64) {
      // Delete old image if exists
      if (existingSupplier.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingSupplier.imagePublicId);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      
      try {
        const result = await cloudinary.uploader.upload(req.body.imageBase64, {
          folder: 'suppliers',
          quality: 'auto:best',
          fetch_format: 'auto'
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(400).json({ success: false, message: 'Image upload failed', error: cloudErr.message });
      }
    }
    
    const updateData = { ...req.body };
    if (imageUrl) updateData.image = imageUrl;
    if (imagePublicId) updateData.imagePublicId = imagePublicId;
    delete updateData.imageBase64;
    
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
