import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getLowStockProducts, getStockTransactions } from '../api/api';
import '../styles/Dashboard.css';

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/drwkjqkun/image/upload/v1767100822/no-image-available-icon-vector_jaw6iv.jpg';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    recentTransactions: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, lowStockRes, transactionsRes] = await Promise.all([
        getProducts(),
        getLowStockProducts(),
        getStockTransactions()
      ]);

      setStats({
        totalProducts: productsRes.data.count,
        lowStockItems: lowStockRes.data.count,
        recentTransactions: transactionsRes.data.count,
      });

      setLowStockProducts(lowStockRes.data.data.slice(0, 5));
      setRecentTransactions(transactionsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card alert">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.lowStockItems}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.recentTransactions}</h3>
            <p>Total Transactions</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Low Stock Alerts</h2>
            <Link to="/products">View All</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="empty-state">No low stock items</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>Min Level</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.image || DEFAULT_IMAGE_URL} 
                          alt={product.name}
                          className="product-image-small"
                          onError={(e) => {
                            e.target.src = DEFAULT_IMAGE_URL;
                          }}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td className="stock-low">{product.quantity}</td>
                      <td>{product.minStockLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/stock">View All</Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="empty-state">No recent transactions</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(transaction => (
                    <tr key={transaction._id}>
                      <td>{transaction.product?.name || 'N/A'}</td>
                      <td>
                        <span className={`badge badge-${transaction.type}`}>
                          {transaction.type === 'in' ? 'In' : 'Out'}
                        </span>
                      </td>
                      <td>{transaction.quantity}</td>
                      <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
