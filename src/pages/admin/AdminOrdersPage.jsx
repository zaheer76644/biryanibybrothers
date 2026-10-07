import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchAdminOrders,
  fetchAdminOrder,
  updateOrderStatus,
} from "../../services/adminService";
import { formatINR } from "../../utils/currency";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

const FLOW = ["PLACED", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

export function AdminOrdersList() {
  const [data, setData] = useState({ orders: [] });
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const next = await fetchAdminOrders({
      status: status || undefined,
      search: search || undefined,
      limit: 50,
    });
    setData(next);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
    const timer = window.setInterval(() => load().catch(() => {}), 25000);
    return () => window.clearInterval(timer);
  }, [status]);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1>Orders</h1>
        <div className="admin-filters">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {FLOW.concat("CANCELLED").map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order / mobile"
          />
          <Button type="button" variant="outline" onClick={load}>
            Search
          </Button>
        </div>
      </header>
      {loading ? (
        <Loader label="Loading orders…" />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>
                  {order.customerSnapshot?.name}
                  <br />
                  <small>{order.customerSnapshot?.mobile}</small>
                </td>
                <td>{formatINR(order.total)}</td>
                <td>
                  {order.paymentMethod}
                  <br />
                  <small>{order.paymentStatus}</small>
                </td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/admin/orders/${order._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setOrder(await fetchAdminOrder(id));
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="field__error">{error}</p>;
  if (!order) return <Loader label="Loading order…" />;

  async function setStatus(status) {
    if (status === "CANCELLED" && !window.confirm("Cancel this order?")) return;
    const updated = await updateOrderStatus(id, {
      status,
      confirm: status === "CANCELLED",
    });
    setOrder(updated);
  }

  const nextStatus = FLOW[FLOW.indexOf(order.orderStatus) + 1];

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1>{order.orderId}</h1>
        <div className="admin-quick">
          {nextStatus && (
            <Button type="button" onClick={() => setStatus(nextStatus)}>
              Mark {nextStatus}
            </Button>
          )}
          {order.orderStatus !== "CANCELLED" && order.orderStatus !== "DELIVERED" && (
            <Button type="button" variant="outline" onClick={() => setStatus("CANCELLED")}>
              Cancel
            </Button>
          )}
          <Button to="/admin/orders" variant="outline">
            Back
          </Button>
        </div>
      </header>

      <div className="admin-detail-grid">
        <section>
          <h2>Customer</h2>
          <p>
            {order.customerSnapshot?.name}
            <br />
            {order.deliveryAddress?.mobile}
          </p>
          <h2>Address</h2>
          <p>
            {order.deliveryAddress?.flatHouse}, {order.deliveryAddress?.buildingSociety}
            <br />
            {order.deliveryAddress?.area}
            <br />
            {order.deliveryAddress?.pincode}
            <br />
            {order.deliveryAddress?.instructions}
          </p>
        </section>
        <section>
          <h2>Items</h2>
          <ul>
            {order.items.map((item, index) => (
              <li key={`${item.productName}-${index}`}>
                {item.quantity} × {item.productName} — {formatINR(item.itemTotal)}
                {item.addOns?.length > 0 && (
                  <small> (+ {item.addOns.map((a) => a.name).join(", ")})</small>
                )}
              </li>
            ))}
          </ul>
          <p>Subtotal: {formatINR(order.subtotal)}</p>
          <p>Delivery: {formatINR(order.deliveryFee)}</p>
          <p>Discount: {formatINR(order.discount || 0)}</p>
          <p>
            <strong>Total: {formatINR(order.total)}</strong>
          </p>
          <p>
            Payment: {order.paymentMethod} / {order.paymentStatus}
          </p>
        </section>
        <section>
          <h2>Timeline</h2>
          <ol className="status-timeline">
            {(order.statusHistory || []).map((entry, index) => (
              <li key={`${entry.status}-${index}`}>
                <strong>{entry.status}</strong>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
