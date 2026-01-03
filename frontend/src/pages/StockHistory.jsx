import { useState, useEffect } from 'react';
import { getStockTransactions } from '../api/api';

const StockHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getStockTransactions();
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Stock Transaction History</h1>
      </div>

      <div className="filter-bar">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Transactions
        </button>
        <button 
          className={filter === 'in' ? 'active' : ''}
          onClick={() => setFilter('in')}
        >
          Stock In
        </button>
        <button 
          className={filter === 'out' ? 'active' : ''}
          onClick={() => setFilter('out')}
        >
          Stock Out
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Previous Stock</th>
                <th>New Stock</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td>{transaction.product?.name || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${transaction.type}`}>
                      {transaction.type === 'in' ? 'In' : 'Out'}
                    </span>
                  </td>
                  <td><strong>{transaction.quantity}</strong></td>
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
  );
};

export default StockHistory;
