import { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  fetchAdminCoupons,
  createCoupon,
  fetchAdminCustomers,
  fetchAdminReviews,
  approveReview,
  fetchAdminSettings,
  updateAdminSettings,
} from "../../services/adminService";
import { formatINR } from "../../utils/currency";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import api from "../../services/api";

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  async function load() {
    setCategories(await fetchAdminCategories());
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="admin-page">
      <h1>Categories</h1>
      <form
        className="admin-inline-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await api.post("/admin/categories", { name });
          setName("");
          await load();
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category" required />
        <Button type="submit">Add</Button>
      </form>
      <ul>
        {categories.map((c) => (
          <li key={c._id}>
            {c.name} ({c.slug}) — {c.isActive ? "Active" : "Hidden"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minimumOrder: 199,
    firstOrderOnly: false,
  });

  async function load() {
    setCoupons(await fetchAdminCoupons());
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="admin-page">
      <h1>Coupons</h1>
      <form
        className="auth-form admin-inline-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await createCoupon(form);
          await load();
        }}
      >
        <input
          placeholder="CODE"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          required
        />
        <select
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
        >
          <option value="PERCENTAGE">PERCENTAGE</option>
          <option value="FLAT">FLAT</option>
        </select>
        <input
          type="number"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
        />
        <label>
          <input
            type="checkbox"
            checked={form.firstOrderOnly}
            onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })}
          />{" "}
          First order only
        </label>
        <Button type="submit">Create coupon</Button>
      </form>
      <ul>
        {coupons.map((c) => (
          <li key={c._id}>
            <strong>{c.code}</strong> — {c.discountType} {c.discountValue} · used {c.usageCount}
            {c.isActive ? "" : " (inactive)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminCustomersPage() {
  const [data, setData] = useState({ customers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminCustomers({ limit: 50 })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading customers…" />;

  return (
    <div className="admin-page">
      <h1>Customers</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Orders</th>
            <th>Spend</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.mobile}</td>
              <td>{c.email || "—"}</td>
              <td>{c.totalOrders}</td>
              <td>{formatINR(c.totalSpend || 0)}</td>
              <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
              <td>{c.isActive ? "Active" : "Disabled"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);

  async function load() {
    setReviews(await fetchAdminReviews());
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="admin-page">
      <h1>Reviews</h1>
      <ul>
        {reviews.map((r) => (
          <li key={r._id}>
            {r.customerName} · {r.rating}/5 · {r.comment || "(no comment)"} ·{" "}
            {r.isApproved ? "Approved" : "Pending"}
            {!r.isApproved && (
              <button type="button" onClick={async () => { await approveReview(r._id); await load(); }}>
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminSettings().then(setSettings).catch(() => {});
  }, []);

  if (!settings) return <Loader label="Loading settings…" />;

  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          const updated = await updateAdminSettings(settings);
          setSettings(updated);
          setSaving(false);
        }}
      >
        {[
          ["minimumOrder", "Minimum order"],
          ["deliveryFee", "Delivery fee"],
          ["freeDeliveryAbove", "Free delivery above"],
          ["whatsappNumber", "WhatsApp number"],
          ["contactNumber", "Contact number"],
          ["announcement", "Announcement"],
        ].map(([key, label]) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input
              value={settings[key] ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  [key]: ["minimumOrder", "deliveryFee", "freeDeliveryAbove"].includes(key)
                    ? Number(e.target.value)
                    : e.target.value,
                })
              }
            />
          </div>
        ))}
        <label className="confirm-check">
          <input
            type="checkbox"
            checked={settings.acceptingOrders}
            onChange={(e) =>
              setSettings({
                ...settings,
                acceptingOrders: e.target.checked,
                manualOverride: e.target.checked ? null : "PAUSED",
              })
            }
          />
          <span>Accepting orders</span>
        </label>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
