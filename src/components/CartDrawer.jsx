import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { whatsappHref } from "../utils/whatsapp";
import Button from "./Button";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import OrderSummary from "./OrderSummary";

function cartMessage(items, pricing) {
  const lines = items.map((item) => {
    const extras = item.addOns?.length ? ` (${item.addOns.map((addon) => addon.name).join(", ")})` : "";
    return `• ${item.name} x ${item.quantity}${extras}`;
  });
  return `Hello Biryani By Brothers, I would like to order:\n${lines.join("\n")}\nTotal: ₹${pricing.total}`;
}

export default function CartDrawer() {
  const { items, pricing, isDrawerOpen, closeDrawer, getCartCount } = useCart();
  const ref = useFocusTrap(isDrawerOpen);
  const count = getCartCount();

  return (
    <>
      <div
        className={`overlay ${isDrawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        hidden={!isDrawerOpen}
      />
      <aside
        ref={ref}
        className={`drawer ${isDrawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
        inert={!isDrawerOpen}
        aria-hidden={!isDrawerOpen}
      >
        <header className="drawer__head">
          <h2>Your box {count > 0 ? `(${count})` : ""}</h2>
          <button type="button" className="icon-btn icon-btn--dark" onClick={closeDrawer} aria-label="Close cart">
            <X size={20} />
          </button>
        </header>
        {items.length === 0 ? (
          <EmptyCart compact />
        ) : (
          <div className="drawer__body">
            <div className="drawer__items">
              {items.map((item) => (
                <CartItem key={item.lineId} item={item} />
              ))}
            </div>
            <footer className="drawer__foot">
              <OrderSummary
                pricing={pricing}
                action={
                  <Button to="/checkout" disabled={pricing.shortOfMinimum > 0}>
                    Proceed to Checkout
                  </Button>
                }
              />
              <Link to="/cart" className="link-arrow" onClick={closeDrawer}>
                View full cart
              </Link>
              <a
                className="quiet-link"
                href={whatsappHref(cartMessage(items, pricing))}
                target="_blank"
                rel="noreferrer"
              >
                Or send this order on WhatsApp
              </a>
            </footer>
          </div>
        )}
      </aside>
    </>
  );
}
