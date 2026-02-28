import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';
import { getProduct, stockIn, stockOut, getProductTransactions } from '../api/api';
import { PageLoader } from '../components/Loader';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, transactionsRes] = await Promise.all([
        getProduct(id),
        getProductTransactions(id)
      ]);
      setProduct(productRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12">
            <PageLoader />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl backdrop-blur-sm border border-white/10">
            <Package className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Stock Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">{product.name}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all duration-200 border border-white/10"
        >
          ← Back to Products
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Product Info Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Current Stock Information
          </h3>
          
          <div className="mb-6">
            <img
              src={product.image || DEFAULT_IMAGE_URL}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE_URL;
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-gray-400">Current Quantity</span>
              <span className="text-2xl font-bold text-white">
                {product.quantity} {product.unit}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-gray-400">Min Stock Level</span>
              <span className="text-lg font-semibold text-gray-300">
                {product.minStockLevel} {product.unit}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-gray-400">Status</span>
              <span>
                {product.quantity === 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    Out of Stock
                  </span>
                ) : product.isLowStock ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Low Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    In Stock
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 text-sm block mb-1">Category</span>
                <span className="text-white font-medium">{product.category?.name || 'N/A'}</span>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 text-sm block mb-1">Price</span>
                <span className="text-white font-medium">${product.price.toFixed(2)}</span>
              </div>

              <div className="col-span-2 p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400 text-sm block mb-1">Supplier</span>
                <span className="text-white font-medium">{product.supplier?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Update Form */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Update Stock</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'in' })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl font-medium transition-all ${
                    formData.type === 'in'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <ArrowUpCircle className="w-5 h-5" />
                  Stock In
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'out' })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl font-medium transition-all ${
                    formData.type === 'out'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  Stock Out
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter reason for this transaction..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              <Package className="w-5 h-5" />
              Update Stock
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Transaction History</h3>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Package className="w-12 h-12 mb-3 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300">Quantity</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300">Previous</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300">New</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-300">Reason</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'in'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {transaction.type === 'in' ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <ArrowDownCircle className="w-3 h-3" />
                        )}
                        {transaction.type === 'in' ? 'In' : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{transaction.quantity}</td>
                    <td className="px-4 py-3 text-gray-400">{transaction.previousQuantity}</td>
                    <td className="px-4 py-3 text-gray-400">{transaction.newQuantity}</td>
                    <td className="px-4 py-3 text-gray-400">{transaction.reason || '-'}</td>
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
