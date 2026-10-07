import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { flushSync } from "react-dom";
import { Check } from "lucide-react";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/currency";
import { fetchMyOrder } from "../services/orderService";
import Button from "../components/Button";
import WhatsAppIcon from "../components/WhatsAppIcon";
import Ornament from "../components/Ornament";
import Loader from "../components/Loader";

export default function OrderConfirmationPage() {
  usePageMeta({
    title: pageTitle("Order confirmed"),
    description: "Your Biryani By Brothers order is noted. Pay by cash or UPI on delivery.",
  });
  const { orderId } = useParams();
  const { state } = useLocation();
  const { replaceCart, notify } = useCart();
  const { getProduct } = useCatalog();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const whatsapp = state?.whatsapp;

  useEffect(() => {
    let active = true;
    (async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const full = await fetchMyOrder(orderId);
        if (active) setOrder(full);
      } catch {
        if (active && state?.order) {
          setOrder({
            orderId: state.order.orderId,
            total: state.order.total,
            paymentMethod: state.order.paymentMethod,
            orderStatus: state.order.orderStatus,
            estimatedDeliveryMinutes: state.order.estimatedDeliveryTime,
            items: [],
            deliveryAddress: {},
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId, isAuthenticated, state]);

  if (loading) {
    return (
      <div className="page empty">
        <Loader label="Loading your order…" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page empty">
        <p className="kicker">No order yet</p>
        <h1>Your box is still empty.</h1>
        <Button to="/menu">Explore Menu</Button>
      </div>
    );
  }

  function orderAgain() {
    const next = [];
    const skipped = [];
    for (const item of order.items || []) {
      const product = getProduct(item.product) || getProduct(item.productName);
      if (!product || product.available === false) {
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

  const address = order.deliveryAddress || {};
  const paymentLabel =
    order.paymentMethod === "UPI_ON_DELIVERY" ? "UPI on Delivery" : "Cash on Delivery";
  const eta = order.estimatedDeliveryMinutes || state?.order?.estimatedDeliveryTime || { min: 30, max: 45 };

  return (
    <div className="page confirm">
      <div className="wrap confirm__card">
        <div className="confirm__mark" aria-hidden="true">
          <Check size={28} />
        </div>
        <p className="kicker">Order confirmed</p>
        <h1>Order Confirmed!</h1>
        <Ornament />
        <p className="confirm__thanks">Thank you for ordering from Biryani By Brothers.</p>
        <p className="confirm__id">
          Order number <strong>{order.orderId}</strong>
        </p>

        {order.items?.length > 0 && (
          <ul className="confirm__items">
            {order.items.map((item, index) => (
              <li key={`${item.productName}-${index}`}>
                <span>
                  {item.productName} × {item.quantity}
                  {item.addOns?.length > 0 && (
                    <small>{item.addOns.map((addon) => addon.name).join(", ")}</small>
                  )}
                </span>
                <span>{formatINR(item.itemTotal)}</span>
              </li>
            ))}
          </ul>
        )}

        <dl className="confirm__meta">
          <div>
            <dt>Total</dt>
            <dd>{formatINR(order.total)}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{paymentLabel}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{order.orderStatus}</dd>
          </div>
          <div>
            <dt>Estimated delivery</dt>
            <dd>
              {eta.min}–{eta.max} minutes
            </dd>
          </div>
        </dl>

        {address.flatHouse && (
          <div className="confirm__address">
            <p className="kicker">Delivering to</p>
            <p>
              {address.fullName}
              <br />
              {address.flatHouse}, {address.buildingSociety}
              <br />
              {address.area}
              {address.landmark ? `, ${address.landmark}` : ""}
              <br />
              {address.pincode}
            </p>
          </div>
        )}

        <div className="confirm__actions">
          <Button to={`/account/orders/${order.orderId}`}>Track Order</Button>
          <Button to="/account/orders" variant="outline">
            My Orders
          </Button>
          <Button variant="outline" onClick={orderAgain}>
            Order Again
          </Button>
          <Button to="/menu" variant="outline">
            Continue Shopping
          </Button>
        </div>

        {whatsapp?.url && (
          <a className="confirm__wa" href={whatsapp.url} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Share order on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
