import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getProducts, deleteProduct, getLowStockProducts } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from "../components/Animations";
import { SkeletonCard } from "../components/Skeleton";
import {
  Package,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/drwkjqkun/image/upload/v1767100822/no-image-available-icon-vector_jaw6iv.jpg";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // Check if user can modify products (Admin or Store Manager)
  const canModify = user?.role === "Admin" || user?.role === "Store Manager";

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page on new search
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [filter, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (filter === "low-stock") {
        const response = await getLowStockProducts();
        setProducts(response.data.data);
        setTotalPages(1);
        setTotal(response.data.count);
      } else {
        const response = await getProducts({
          page,
          limit: 12,
          search: searchQuery
        });
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteModal.productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const openDeleteModal = (product) => {
    setDeleteModal({ isOpen: true, productId: product._id, productName: product.name });
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Package className="w-10 h-10 text-blue-400" />
                Products
              </h1>
              <p className="text-gray-400">Manage your product inventory</p>
            </div>
            {canModify && (
              <button
                onClick={() => navigate("/products/add")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, category, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${filter === "all"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setFilter("low-stock")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${filter === "low-stock"
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Low Stock
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12 shadow-2xl text-center">
              <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first product"}
              </p>
              {canModify && !searchQuery && (
                <button
                  onClick={() => navigate("/products/add")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Product
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="max-w-7xl mx-auto">
            {/* Results count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-gray-400"
            >
              Showing {products.length} of {total} products
            </motion.div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <StaggerItem key={product._id}>
                  <HoverCard
                    className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/50 h-full"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-800/50">
                      <img
                        src={product.image || DEFAULT_IMAGE_URL}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE_URL;
                        }}
                      />
                      {/* Low Stock Badge */}
                      {product.isLowStock && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold shadow-lg">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </div>
                      )}
                      {/* Stock Badge */}
                      {!product.isLowStock && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold shadow-lg">
                          In Stock
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-gray-200 font-medium">
                            {product.category?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Supplier:</span>
                          <span className="text-gray-200 font-medium truncate ml-2">
                            {product.supplier?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Stock:</span>
                          <span
                            className={`font-bold ${product.isLowStock ? "text-red-400" : "text-green-400"
                              }`}
                          >
                            {product.quantity} units
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/10">
                        <span className="text-gray-400 text-sm">Price:</span>
                        <span className="text-2xl font-bold text-white">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/products/stock/${product._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                          title="Manage Stock"
                        >
                          <Package className="w-4 h-4" />
                          Stock
                        </button>
                        {canModify && (
                          <>
                            <button
                              onClick={() => navigate(`/products/edit/${product._id}`)}
                              className="flex items-center justify-center p-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(product)}
                              className="flex items-center justify-center p-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Pagination Controls */}
            {totalPages > 1 && filter !== "low-stock" && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-gray-400">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
          onConfirm={handleDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
        />
      </div>
    </PageTransition>
  );
};

export default Products;
