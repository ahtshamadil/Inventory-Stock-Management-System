import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, stockIn, stockOut, getProductTransactions } from '../api/api';
import '../styles/StockManagement.css';

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/drwkjqkun/image/upload/v1767100822/no-image-available-icon-vector_jaw6iv.jpg';

const StockManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    quantity: '',
    reason: '',
    type: 'in'
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [productRes, transactionsRes] = await Promise.all([
        getProduct(id),
        getProductTransactions(id)
      ]);
      setProduct(productRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        product: id,
        quantity: parseInt(formData.quantity),
        reason: formData.reason
      };

      if (formData.type === 'in') {
        await stockIn(data);
      } else {
        await stockOut(data);
      }

      setFormData({ quantity: '', reason: '', type: 'in' });
      fetchData();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert(error.response?.data?.message || 'Failed to update stock');
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="stock-header">
        <div>
          <h1>Stock Management</h1>
          <h2>{product.name}</h2>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>
          ← Back to Products
        </button>
      </div>

      <div className="stock-grid">
        <div className="stock-info-card">
          <h3>Current Stock Information</h3>
          <div className="product-image-container">
            <img 
              src={product.image || DEFAULT_IMAGE_URL} 
              alt={product.name}
              className="product-image-large"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE_URL;
              }}
            />
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Current Quantity:</span>
              <span className="value">{product.quantity} {product.unit}</span>
            </div>
            <div className="info-item">
              <span className="label">Min Stock Level:</span>
              <span className="value">{product.minStockLevel} {product.unit}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value">
                {product.quantity === 0 ? (
                  <span className="badge badge-danger">Out of Stock</span>
                ) : product.isLowStock ? (
                  <span className="badge badge-warning">Low Stock</span>
                ) : (
                  <span className="badge badge-success">In Stock</span>
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Category:</span>
              <span className="value">{product.category?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Supplier:</span>
              <span className="value">{product.supplier?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Price:</span>
              <span className="value">${product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="stock-form-card">
          <h3>Update Stock</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Transaction Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="in"
                    checked={formData.type === 'in'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  />
                  Stock In
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="out"
                    checked={formData.type === 'out'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  />
                  Stock Out
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                rows="3"
                placeholder="Enter reason for this transaction..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update Stock
            </button>
          </form>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions yet</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${transaction.type}`}>
                        {transaction.type === 'in' ? 'In' : 'Out'}
                      </span>
                    </td>
                    <td>{transaction.quantity}</td>
                    <td>{transaction.previousQuantity}</td>
                    <td>{transaction.newQuantity}</td>
                    <td>{transaction.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
