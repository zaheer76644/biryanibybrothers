import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboard, updateAdminSettings, fetchAdminSettings } from "../../services/adminService";
import { formatINR } from "../../utils/currency";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const [dash, sett] = await Promise.all([fetchDashboard(), fetchAdminSettings()]);
    setData(dash);
    setSettings(sett);
  }

  useEffect(() => {
    let active = true;
    let timer;
    (async () => {
      try {
        await load();
      } catch (err) {
        if (active) setError(err.message);
      }
    })();
    timer = window.setInterval(() => {
      load().catch(() => {});
    }, 25000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (error) return <p className="field__error">{error}</p>;
  if (!data) return <Loader label="Loading dashboard…" />;

  async function toggleOrders() {
    const next = !(settings?.acceptingOrders);
    const updated = await updateAdminSettings({
      acceptingOrders: next,
      manualOverride: next ? null : "PAUSED",
    });
    setSettings(updated);
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1>Dashboard</h1>
        <div className="admin-quick">
          <Button type="button" onClick={toggleOrders}>
            {settings?.acceptingOrders === false ? "Resume Orders" : "Pause Orders"}
          </Button>
          <Button to="/admin/products" variant="outline">
            Add / Edit Product
          </Button>
          <Button to="/admin/orders" variant="outline">
            View Orders
          </Button>
        </div>
      </header>

      <div className="admin-cards">
        <article>
          <p>Today’s Orders</p>
          <strong>{data.today.orders}</strong>
        </article>
        <article>
          <p>Today’s Revenue</p>
          <strong>{formatINR(data.today.revenue)}</strong>
        </article>
        <article>
          <p>Average Order Value</p>
          <strong>{formatINR(data.today.averageOrderValue)}</strong>
        </article>
        <article>
          <p>Orders Preparing</p>
          <strong>{data.today.preparing}</strong>
        </article>
        <article>
          <p>New Customers</p>
          <strong>{data.customerSummary.newCustomersToday}</strong>
        </article>
      </div>

      <section>
        <h2>Recent orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Time</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((order) => (
              <tr key={order._id || order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customerSnapshot?.name}</td>
                <td>{formatINR(order.total)}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                <td>
                  <Link to={`/admin/orders/${order._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
