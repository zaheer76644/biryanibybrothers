import { useEffect, useState } from "react";
import {
  fetchAdminProducts,
  fetchAdminCategories,
  updateProductAvailability,
  updateProductStock,
  upsertProduct,
} from "../../services/adminService";
import { formatINR } from "../../utils/currency";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    foodType: "non-veg",
    description: "",
    image: "",
    isAvailable: true,
    allowAddOns: false,
  });

  async function load() {
    const [rows, cats] = await Promise.all([fetchAdminProducts(), fetchAdminCategories()]);
    setProducts(rows);
    setCategories(cats);
    if (!form.category && cats[0]) setForm((prev) => ({ ...prev, category: cats[0]._id }));
  }

  useEffect(() => {
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading products…" />;

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1>Menu</h1>
      </header>

      <form
        className="auth-form admin-inline-form"
        onSubmit={async (event) => {
          event.preventDefault();
          await upsertProduct(null, {
            ...form,
            price: Number(form.price),
            slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          });
          setForm((prev) => ({ ...prev, name: "", price: "", description: "", image: "" }));
          await load();
        }}
      >
        <h2>Add product</h2>
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Food type</label>
          <select value={form.foodType} onChange={(e) => setForm({ ...form, foodType: e.target.value })}>
            <option value="veg">veg</option>
            <option value="non-veg">non-veg</option>
            <option value="egg">egg</option>
          </select>
        </div>
        <div className="field">
          <label>Image key / URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit">Add Product</Button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
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
                {product.name}
                <br />
                <small>{product.slug}</small>
              </td>
              <td>{formatINR(product.price)}</td>
              <td>
                {product.trackStock ? (
                  <>
                    {product.availableStock ?? product.dailyStock - product.soldQuantity} left
                    <br />
                    <input
                      type="number"
                      defaultValue={product.dailyStock}
                      style={{ width: 80 }}
                      onBlur={async (e) => {
                        await updateProductStock(product._id, {
                          dailyStock: Number(e.target.value),
                          resetSold: false,
                        });
                        await load();
                      }}
                    />
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td>{product.isAvailable ? "AVAILABLE" : "SOLD OUT"}</td>
              <td>
                <button
                  type="button"
                  onClick={async () => {
                    await updateProductAvailability(product._id, !product.isAvailable);
                    await load();
                  }}
                >
                  {product.isAvailable ? "Mark sold out" : "Mark available"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
