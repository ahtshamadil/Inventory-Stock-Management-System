import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts, getLowStockProducts, getStockTransactions, getCategories } from '../api/api';
import { Package, AlertTriangle, TrendingUp, ArrowRight, ArrowUpCircle, ArrowDownCircle, DollarSign, BarChart3 } from 'lucide-react';
import { SkeletonDashboard } from '../components/Skeleton';
import { StaggerContainer, StaggerItem, HoverCard } from '../components/Animations';
import { CategoryChart, StockChart, TransactionTrendChart, InventoryValueChart } from '../components/Charts';
import { useToast } from '../context/ToastContext';

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/drwkjqkun/image/upload/v1767100822/no-image-available-icon-vector_jaw6iv.jpg';

// Animated counter component
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    recentTransactions: 0,
    totalValue: 0,
  });
  const [allProducts, setAllProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, lowStockRes, transactionsRes, categoriesRes] = await Promise.all([
        getProducts({ limit: 100 }),
        getLowStockProducts(),
        getStockTransactions(),
        getCategories()
      ]);

      const products = productsRes.data.data;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

      setAllProducts(products);
      setStats({
        totalProducts: productsRes.data.total || productsRes.data.count,
        lowStockItems: lowStockRes.data.count,
        recentTransactions: transactionsRes.data.count,
        totalValue,
      });

      setLowStockProducts(lowStockRes.data.data.slice(0, 5));
      setRecentTransactions(transactionsRes.data.data.slice(0, 5));
      setAllTransactions(transactionsRes.data.data);

      // Add product count to categories
      const categoriesWithCount = categoriesRes.data.data.map(cat => ({
        ...cat,
        productCount: products.filter(p => p.category?._id === cat._id).length
      }));
      setCategories(categoriesWithCount);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your NexStock overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StaggerItem>
            <HoverCard>
              <div className="glass-effect rounded-2xl p-6 group cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Products</p>
                    <h3 className="text-3xl font-bold text-white">
                      <AnimatedNumber value={stats.totalProducts} />
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard>
              <div className="glass-effect rounded-2xl p-6 group cursor-default border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 text-sm font-medium mb-1">Low Stock Alerts</p>
                    <h3 className="text-3xl font-bold text-white">
                      <AnimatedNumber value={stats.lowStockItems} />
                    </h3>
                  </div>
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
                    animate={stats.lowStockItems > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </motion.div>
                </div>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard>
              <div className="glass-effect rounded-2xl p-6 group cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Transactions</p>
                    <h3 className="text-3xl font-bold text-white">
                      <AnimatedNumber value={stats.recentTransactions} />
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </HoverCard>
          </StaggerItem>

          <StaggerItem>
            <HoverCard>
              <div className="glass-effect rounded-2xl p-6 group cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Inventory Value</p>
                    <h3 className="text-2xl font-bold text-white">
                      $<AnimatedNumber value={Math.round(stats.totalValue)} />
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-110">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Charts Row */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6" delay={0.2}>
          <StaggerItem>
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">Stock Levels</h2>
              </div>
              {allProducts.length > 0 ? (
                <StockChart products={allProducts} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  No product data available
                </div>
              )}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">Categories Distribution</h2>
              </div>
              {categories.length > 0 ? (
                <CategoryChart categories={categories} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  No category data available
                </div>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Secondary Charts Row */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6" delay={0.3}>
          <StaggerItem>
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">Transaction Trend (7 Days)</h2>
              </div>
              <TransactionTrendChart transactions={allTransactions} />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">Inventory Value by Category</h2>
              </div>
              {allProducts.length > 0 ? (
                <InventoryValueChart products={allProducts} />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Low Stock & Recent Transactions Row */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6" delay={0.4}>
          {/* Low Stock Alerts */}
          <StaggerItem>
            <div className="glass-effect rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Low Stock Alerts</h2>
                </div>
                <Link
                  to="/products"
                  className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors duration-300"
                >
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 rounded-full mb-3">
                    <Package className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="text-slate-400 text-sm">All stock levels are healthy!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <img
                        src={product.image || DEFAULT_IMAGE_URL}
                        alt={product.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE_URL; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{product.name}</p>
                        <p className="text-slate-400 text-sm">Min: {product.minStockLevel}</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
                        {product.quantity}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </StaggerItem>

          {/* Recent Transactions */}
          <StaggerItem>
            <div className="glass-effect rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                </div>
                <Link
                  to="/stock"
                  className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors duration-300"
                >
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-500/10 rounded-full mb-3">
                    <TrendingUp className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-sm">No recent transactions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'in'
                          ? 'bg-emerald-500/20'
                          : 'bg-red-500/20'
                        }`}>
                        {transaction.type === 'in'
                          ? <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
                          : <ArrowDownCircle className="w-5 h-5 text-red-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {transaction.product?.name || 'N/A'}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${transaction.type === 'in'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                        }`}>
                        {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Dashboard;
