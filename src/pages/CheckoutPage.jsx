import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useCart } from "../context/CartContext";
import PageHero from "../components/PageHero";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";

export default function CheckoutPage() {
  usePageMeta({
    title: pageTitle("Checkout"),
    description: "Place a Biryani By Brothers order for delivery in Mira Road. Pay by cash or UPI on delivery.",
  });
  const { pricing, items } = useCart();

  return (
    <div className="page">
      <PageHero
        eyebrow="Checkout"
        title="Where should we deliver?"
        text="Cash or UPI when the order arrives. No online payment."
      />
      <section className="section section--cream">
        <div className="wrap checkout">
          <CheckoutForm />
          <aside className="checkout__aside">
            {items.length > 0 && <OrderSummary pricing={pricing} />}
          </aside>
        </div>
      </section>
    </div>
  );
}
