import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct, getCategories, getSuppliers } from '../api/api';
import '../styles/ProductForm.css';

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/drwkjqkun/image/upload/v1767100822/no-image-available-icon-vector_jaw6iv.jpg';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    price: '',
    costPrice: '',
    quantity: '',
    minStockLevel: '',
    unit: 'piece'
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    fetchDropdownData();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [categoriesRes, suppliersRes] = await Promise.all([
        getCategories(),
        getSuppliers()
      ]);
      setCategories(categoriesRes.data.data);
      setSuppliers(suppliersRes.data.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await getProduct(id);
      const product = response.data.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        supplier: product.supplier?._id || product.supplier || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        quantity: product.quantity || '',
        minStockLevel: product.minStockLevel || '',
        unit: product.unit || 'piece'
      });
      if (product.image) {
        setExistingImage(product.image);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product. Redirecting...');
      navigate('/products');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let dataToSend = { ...formData };
      if (imageFile) {
        // Convert image to base64 (binary string)
        const base64 = await toBase64(imageFile);
        dataToSend.imageBase64 = base64;
      } else if (removeImage && isEdit) {
        // If user wants to remove existing image, send empty string
        dataToSend.imageBase64 = '';
      }
      if (isEdit) {
        await updateProduct(id, dataToSend);
      } else {
        await createProduct(dataToSend);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  // Helper to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Supplier *</label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map(sup => (
                  <option key={sup._id} value={sup._id}>{sup.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cost Price *</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Selling Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Initial Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Min Stock Level *</label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="piece">Piece</option>
                <option value="box">Box</option>
                <option value="kg">Kilogram</option>
                <option value="liter">Liter</option>
                <option value="meter">Meter</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="image-preview">
                <img 
                  src={imagePreview || (removeImage ? DEFAULT_IMAGE_URL : existingImage) || DEFAULT_IMAGE_URL} 
                  alt="Product preview"
                  className="preview-image"
                />
                {(imagePreview || existingImage) && (
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setExistingImage(null);
                      setRemoveImage(true);
                      // Reset file input
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput) {
                        fileInput.value = '';
                      }
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
