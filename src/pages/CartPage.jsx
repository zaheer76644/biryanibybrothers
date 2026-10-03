import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useCart } from "../context/CartContext";
import { whatsappHref } from "../utils/whatsapp";
import PageHero from "../components/PageHero";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import EmptyCart from "../components/EmptyCart";
import Button from "../components/Button";

export default function CartPage() {
  usePageMeta({
    title: pageTitle("Cart"),
    description: "Review your Biryani By Brothers order before checkout.",
  });
  const { items, pricing } = useCart();

  return (
    <div className="page">
      <PageHero eyebrow="Your box" title="Cart" text="Check the portions, then tell us where to deliver." />
      <section className="section section--cream">
        <div className="wrap">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {items.map((item) => (
                  <CartItem key={item.lineId} item={item} />
                ))}
              </div>
              <OrderSummary
                pricing={pricing}
                action={
                  <>
                    <Button to="/checkout" disabled={pricing.shortOfMinimum > 0}>
                      Proceed to Checkout
                    </Button>
                    <a
                      className="quiet-link"
                      href={whatsappHref("Hello Biryani By Brothers, I have a question about my order.")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Need help? Chat with us on WhatsApp
                    </a>
                  </>
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
