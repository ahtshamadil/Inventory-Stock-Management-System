import { useState, useEffect } from "react";
import { getProducts, deleteProduct, getLowStockProducts } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/drwkjqkun/image/upload/v1767100822/no-image-available-icon-vector_jaw6iv.jpg";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const response =
        filter === "low-stock"
          ? await getLowStockProducts()
          : await getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products/add")}
        >
          Add Product
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All Products
        </button>
        <button
          className={filter === "low-stock" ? "active" : ""}
          onClick={() => setFilter("low-stock")}
        >
          Low Stock
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image || DEFAULT_IMAGE_URL}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE_URL;
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || "N/A"}</td>
                  <td>{product.supplier?.name || "N/A"}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td className={product.isLowStock ? "stock-low" : "stock-ok"}>
                    {product.quantity}
                  </td>
                  <td>
                    {product.isLowStock ? (
                      <span className="badge badge-warning">Low Stock</span>
                    ) : (
                      <span className="badge badge-success">In Stock</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() =>
                          navigate(`/products/edit/${product._id}`)
                        }
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          navigate(`/products/stock/${product._id}`)
                        }
                        title="Manage Stock"
                      >
                        Stock
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
