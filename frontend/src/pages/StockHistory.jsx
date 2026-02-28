import { useState, useEffect } from 'react';
import { History, ArrowUpCircle, ArrowDownCircle, Package } from 'lucide-react';
import { getStockTransactions } from '../api/api';
import { PageLoader } from '../components/Loader';

const StockHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getStockTransactions();
      console.log('Stock transactions response:', response.data);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10">
            <History className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Stock Transaction History
            </h1>
            <p className="text-gray-400 text-sm mt-1">View all stock movements</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Package className="w-5 h-5" />
          All Transactions
        </button>
        <button
          onClick={() => setFilter('in')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'in'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <ArrowUpCircle className="w-5 h-5" />
          Stock In
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'out'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <ArrowDownCircle className="w-5 h-5" />
          Stock Out
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12">
          <PageLoader />
        </div>
      ) : filteredTransactions.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center h-64 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
          <History className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Start managing stock to see transaction history' 
              : `No ${filter === 'in' ? 'stock in' : 'stock out'} transactions yet`}
          </p>
        </div>
      ) : (
        /* Transactions Table */
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Date & Time</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Quantity</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Previous Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">New Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-white">
                          {transaction.product?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{transaction.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{transaction.previousQuantity}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">{transaction.newQuantity}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{transaction.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockHistory;
