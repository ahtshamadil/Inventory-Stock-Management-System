import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: { family: 'Inter, sans-serif', size: 12 },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#fff',
      bodyColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
};

// Category distribution doughnut chart
export const CategoryChart = ({ categories = [] }) => {
  const colors = [
    'rgba(139, 92, 246, 0.8)',   // violet
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(16, 185, 129, 0.8)',   // emerald
    'rgba(245, 158, 11, 0.8)',   // amber
    'rgba(239, 68, 68, 0.8)',    // red
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(6, 182, 212, 0.8)',    // cyan
    'rgba(168, 85, 247, 0.8)',   // purple
  ];

  const data = {
    labels: categories.map(c => c.name),
    datasets: [{
      data: categories.map(c => c.count || c.productCount || 1),
      backgroundColor: colors.slice(0, categories.length),
      borderColor: colors.slice(0, categories.length).map(c => c.replace('0.8', '1')),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    ...commonOptions,
    cutout: '65%',
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: 'right',
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Stock levels bar chart
export const StockChart = ({ products = [] }) => {
  const sortedProducts = [...products]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 8);

  const data = {
    labels: sortedProducts.map(p => p.name.substring(0, 15) + (p.name.length > 15 ? '...' : '')),
    datasets: [{
      label: 'Current Stock',
      data: sortedProducts.map(p => p.quantity),
      backgroundColor: sortedProducts.map(p => 
        p.isLowStock ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)'
      ),
      borderColor: sortedProducts.map(p => 
        p.isLowStock ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)'
      ),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }, {
      label: 'Min Level',
      data: sortedProducts.map(p => p.minStockLevel),
      backgroundColor: 'rgba(245, 158, 11, 0.5)',
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const options = {
    ...commonOptions,
    indexAxis: 'y',
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
      },
      y: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.8)' },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

// Transaction trend line chart
export const TransactionTrendChart = ({ transactions = [] }) => {
  // Group transactions by date (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const stockInByDay = last7Days.map(date => 
    transactions.filter(t => 
      t.type === 'in' && t.createdAt?.split('T')[0] === date
    ).reduce((sum, t) => sum + t.quantity, 0)
  );

  const stockOutByDay = last7Days.map(date => 
    transactions.filter(t => 
      t.type === 'out' && t.createdAt?.split('T')[0] === date
    ).reduce((sum, t) => sum + t.quantity, 0)
  );

  const data = {
    labels: last7Days.map(d => {
      const date = new Date(d);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Stock In',
        data: stockInByDay,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Stock Out',
        data: stockOutByDay,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

// Inventory value chart
export const InventoryValueChart = ({ products = [] }) => {
  // Group by category and calculate value
  const categoryValues = products.reduce((acc, product) => {
    const categoryName = product.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += product.price * product.quantity;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryValues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const data = {
    labels: sortedCategories.map(([name]) => name),
    datasets: [{
      label: 'Inventory Value ($)',
      data: sortedCategories.map(([, value]) => value),
      backgroundColor: 'rgba(139, 92, 246, 0.7)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const options = {
    ...commonOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.6)',
          callback: (value) => '$' + value.toLocaleString(),
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};
