import { useLocation, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import { Check } from "lucide-react";
import { pageTitle } from "../config/brand";
import { business } from "../config/business";
import { usePageMeta } from "../hooks/usePageMeta";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";
import { orderHelpMessage, whatsappHref } from "../utils/whatsapp";
import Button from "../components/Button";
import WhatsAppIcon from "../components/WhatsAppIcon";

export default function OrderConfirmationPage() {
  usePageMeta({
    title: pageTitle("Order confirmed"),
    description: "Your Biryani By Brothers order is noted. Pay by cash or UPI on delivery.",
  });
  const { state } = useLocation();
  const { lastOrder } = useOrder();
  const { replaceCart } = useCart();
  const navigate = useNavigate();
  const order = state?.order || lastOrder;

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
    flushSync(() => replaceCart(order.items));
    navigate("/cart");
  }

  const address = order.customer;

  return (
    <div className="page confirm">
      <div className="wrap confirm__card">
        <div className="confirm__mark" aria-hidden="true">
          <Check size={28} />
        </div>
        <p className="kicker">Order confirmed</p>
        <h1>Order Confirmed!</h1>
        <p className="confirm__thanks">Thank you for ordering from Biryani By Brothers.</p>
        <p className="confirm__id">
          Order number <strong>{order.id}</strong>
        </p>

        <ul className="confirm__items">
          {order.items.map((item) => {
            const extras = item.addOns || [];
            const line = item.price * item.quantity + extras.reduce((sum, addon) => sum + addon.price * item.quantity, 0);
            return (
              <li key={item.lineId}>
                <span>
                  {item.name} × {item.quantity}
                  {extras.length > 0 && (
                    <small>{extras.map((addon) => `${addon.name} × ${item.quantity}`).join(", ")}</small>
                  )}
                </span>
                <span>{formatINR(line)}</span>
              </li>
            );
          })}
        </ul>

        <dl className="confirm__meta">
          <div>
            <dt>Total</dt>
            <dd>{formatINR(order.totals.total)}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{order.paymentMethod}</dd>
          </div>
          <div>
            <dt>Delivery address</dt>
            <dd>
              {address.flat}, {address.building}
              <br />
              {address.area} {address.pincode}
            </dd>
          </div>
          <div>
            <dt>Expected delivery</dt>
            <dd>{order.expectedDelivery}</dd>
          </div>
        </dl>
        <p className="confirm__note">{business.paymentExtra} {business.paymentNote}</p>

        <div className="confirm__actions">
          <Button to="/">Back to Home</Button>
          <Button variant="outline" onClick={orderAgain}>
            Order Again
          </Button>
        </div>
        <a
          className="btn btn--secondary confirm__wa"
          href={whatsappHref(orderHelpMessage(order.id))}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon /> Need help? Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}
