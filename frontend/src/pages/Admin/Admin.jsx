import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./Admin.css";

const BASE_URL = "https://princy-boutique-backend.onrender.com";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    const res = await axios.get("/products");
    setProducts(res.data.products);
  };

  /* ================= UPDATE PRODUCT ================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", editProduct.name);
      formData.append("price", editProduct.price);
      formData.append("sizes", JSON.stringify(editProduct.sizes || []));
      formData.append("colors", JSON.stringify(editProduct.colors || []));
      formData.append("readyMade", editProduct.readyMade ? "true" : "false");
      formData.append("featured", editProduct.featured ? "true" : "false");

      // MULTIPLE IMAGES
      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await axios.put(`/products/${editProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditProduct(null);
      setNewImages([]);
      fetchProducts();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Sizes</th>
            <th>Colors</th>
            <th>ReadyMade</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img
                  src={
                    p.images?.length
                      ? `${BASE_URL}${p.images[0]}`
                      : "https://via.placeholder.com/60"
                  }
                  alt={p.name}
                  className="admin-product-img"
                />
              </td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.sizes?.join(", ")}</td>
              <td>{p.colors?.join(", ")}</td>
              <td>{p.readyMade ? "Yes" : "No"}</td>
              <td>{p.featured ? "Yes" : "No"}</td>

              <td>
                <button onClick={() => setEditProduct(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Product</h3>

            {/* OLD + NEW IMAGE PREVIEW */}
            <div className="multi-preview">

              {/* OLD IMAGES */}
              {editProduct.images?.map((img, i) => (
                <div key={i} className="img-box">
                  <img src={`${BASE_URL}${img}`} alt="old" />
                </div>
              ))}

              {/* NEW IMAGES */}
              {newImages.map((file, i) => (
                <div key={i} className="img-box new">
                  <img src={URL.createObjectURL(file)} alt="new" />
                </div>
              ))}

            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages([...e.target.files])}
            />

            <input
              value={editProduct.name || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              placeholder="Product Name"
            />

            <input
              value={editProduct.price || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              placeholder="Price"
            />

            <input
              value={editProduct.sizes?.join(",") || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="Sizes (XS,S,M,L)"
            />

            <input
              value={editProduct.colors?.join(",") || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                })
              }
              placeholder="Colors (Pink,Beige,Gold)"
            />

            <label className="checkbox">
              <input
                type="checkbox"
                checked={editProduct.readyMade || false}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, readyMade: e.target.checked })
                }
              />
              Ready Made
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={editProduct.featured || false}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, featured: e.target.checked })
                }
              />
              Featured Product
            </label>

            <div className="modal-buttons">
              <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => {
                setEditProduct(null);
                setNewImages([]);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
