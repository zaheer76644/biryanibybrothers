import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import { formatINR } from "../utils/currency";
import { fetchMyOrders, fetchMyOrder } from "../services/orderService";
import { submitReview } from "../services/reviewService";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import Button from "../components/Button";
import Loader from "../components/Loader";

export function AccountOrdersList() {
  const [data, setData] = useState({ orders: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const next = await fetchMyOrders({ limit: 20 });
        if (active) setData(next);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loader label="Loading orders…" />;
  if (error) return <p className="field__error">{error}</p>;
  if (!data.orders.length) {
    return (
      <section className="account-panel">
        <h2>My Orders</h2>
        <p>No orders yet.</p>
        <Button to="/menu">Explore Menu</Button>
      </section>
    );
  }

  return (
    <section className="account-panel">
      <h2>My Orders</h2>
      <ul className="order-list">
        {data.orders.map((order) => (
          <li key={order._id} className="order-list__item">
            <div>
              <strong>{order.orderId}</strong>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
              <span>
                {order.items.length} item{order.items.length === 1 ? "" : "s"} · {formatINR(order.total)}
              </span>
              <span className={`status-pill status-${order.orderStatus}`}>{order.orderStatus}</span>
            </div>
            <div className="order-list__actions">
              <Link to={`/account/orders/${order.orderId}`}>View / Track</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AccountOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState({ productId: "", rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const { replaceCart, notify } = useCart();
  const { getProduct } = useCatalog();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const next = await fetchMyOrder(orderId);
        if (active) {
          setOrder(next);
          if (next.items?.[0]) {
            setReview((prev) => ({ ...prev, productId: next.items[0].product }));
          }
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) return <Loader label="Loading order…" />;
  if (error || !order) return <p className="field__error">{error || "Order not found."}</p>;

  function orderAgain() {
    const next = [];
    const skipped = [];
    for (const item of order.items) {
      const product = getProduct(item.product);
      if (!product || !product.available) {
        skipped.push(item.productName);
        continue;
      }
      next.push({
        productId: product.id,
        slug: product.slug,
        quantity: item.quantity,
        addOns: (item.addOns || [])
          .map((addon) => {
            const match = product.addOns?.find((a) => a.name === addon.name);
            return match ? { id: match.id, name: match.name, price: match.price } : null;
          })
          .filter(Boolean),
      });
    }
    flushSync(() => replaceCart(next));
    if (skipped.length) notify(`Unavailable: ${skipped.join(", ")}`);
    navigate("/cart");
  }

  async function sendReview(event) {
    event.preventDefault();
    setReviewMsg("");
    try {
      await submitReview({
        orderId: order.orderId,
        productId: review.productId,
        rating: Number(review.rating),
        comment: review.comment,
      });
      setReviewMsg("Review submitted for approval.");
    } catch (err) {
      setReviewMsg(err.message);
    }
  }

  return (
    <section className="account-panel">
      <p className="kicker">Order</p>
      <h2>{order.orderId}</h2>
      <p className={`status-pill status-${order.orderStatus}`}>{order.orderStatus}</p>

      <ol className="status-timeline">
        {(order.statusHistory || []).map((entry, index) => (
          <li key={`${entry.status}-${index}`}>
            <strong>{entry.status}</strong>
            <span>{new Date(entry.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ol>

      <ul className="confirm__items">
        {order.items.map((item, index) => (
          <li key={`${item.productName}-${index}`}>
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatINR(item.itemTotal)}</span>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total:</strong> {formatINR(order.total)} ·{" "}
        {order.paymentMethod === "UPI_ON_DELIVERY" ? "UPI on Delivery" : "Cash on Delivery"}
      </p>

      <div className="confirm__actions">
        <Button onClick={orderAgain}>Order Again</Button>
        <Button to="/account/orders" variant="outline">
          Back to orders
        </Button>
      </div>

      {order.orderStatus === "DELIVERED" && (
        <form className="review-form" onSubmit={sendReview}>
          <h3>Leave a review</h3>
          <div className="field">
            <label htmlFor="productId">Item</label>
            <select
              id="productId"
              value={review.productId}
              onChange={(e) => setReview((prev) => ({ ...prev, productId: e.target.value }))}
            >
              {order.items.map((item) => (
                <option key={item.product} value={item.product}>
                  {item.productName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={review.rating}
              onChange={(e) => setReview((prev) => ({ ...prev, rating: e.target.value }))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              value={review.comment}
              onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
              maxLength={1000}
            />
          </div>
          {reviewMsg && <p>{reviewMsg}</p>}
          <Button type="submit">Submit Review</Button>
        </form>
      )}
    </section>
  );
}
