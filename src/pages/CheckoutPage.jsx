import { Bike, MapPin, Wallet } from "lucide-react";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useCart } from "../context/CartContext";
import PageHero from "../components/PageHero";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";

const steps = [
  { n: "01", label: "Details", Icon: MapPin },
  { n: "02", label: "Payment", Icon: Wallet },
  { n: "03", label: "Delivery", Icon: Bike },
];

export default function CheckoutPage() {
  usePageMeta({
    title: pageTitle("Checkout"),
    description: "Place a Biryani By Brothers order for delivery in Mira Road. Pay by cash or UPI on delivery.",
  });
  const { pricing, items } = useCart();

  return (
    <div className="page page--checkout">
      <PageHero
        variant="checkout"
        eyebrow="Almost there"
        title="Seal the order."
        text="Tell us where to bring the biryani. Pay by cash or UPI when it arrives."
      />

      <section className="checkout-steps-bar">
        <div className="wrap">
          <ol className="checkout-steps">
            {steps.map((step, index) => (
              <li key={step.n} className={index === 0 ? "is-active" : ""}>
                <span className="checkout-steps__n">{step.n}</span>
                <step.Icon size={16} aria-hidden="true" />
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--cream checkout-section">
        <div className="wrap checkout">
          <CheckoutForm />
          <aside className="checkout__aside">
            {items.length > 0 && (
              <OrderSummary pricing={pricing} items={items} accent />
            )}
            <div className="checkout-aside-note">
              <p className="kicker">Mira Road kitchen</p>
              <p>We cook in small batches. Once you place the order, the handi is for you.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
