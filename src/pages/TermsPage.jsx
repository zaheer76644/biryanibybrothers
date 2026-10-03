import { pageTitle } from "../config/brand";
import { business } from "../config/business";
import { deliveryConfig } from "../config/deliveryConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import { formatINR } from "../utils/currency";
import PageHero from "../components/PageHero";

export default function TermsPage() {
  usePageMeta({
    title: pageTitle("Terms & Conditions"),
    description: "Ordering, delivery and payment terms for Biryani By Brothers in Mira Road.",
  });

  return (
    <div className="page">
      <PageHero eyebrow="Terms" title="Terms & Conditions" text="Last updated 3 October 2026." />
      <section className="section section--cream">
        <div className="wrap prose">
          <p>
            These terms cover orders placed with {business.name}, a home kitchen in {business.location}.
          </p>
          <h2>Orders</h2>
          <p>
            Placing an order on this website is a request for that food. Because we cook in small batches, a dish can sell out. If we cannot make an order, we will contact you on the mobile number you gave us.
          </p>
          <h2>Prices and delivery</h2>
          <p>
            Prices are in Indian rupees and shown on the menu. The minimum order is {formatINR(deliveryConfig.minimumOrder)}. Delivery is {formatINR(deliveryConfig.deliveryFee)}, and free when the order reaches {formatINR(deliveryConfig.freeDeliveryAbove)} before the delivery fee. We deliver to {business.deliveryArea.toLowerCase()}.
          </p>
          <h2>Payment</h2>
          <p>
            The only payment method on this website is {business.paymentLabel}. {business.paymentExtra} We do not take payment online.
          </p>
          <h2>Timing</h2>
          <p>
            We are open {business.hoursDetail.toLowerCase()}. “{business.expectedDelivery}” is an estimate from the time an order is accepted. Traffic, the batch and the distance can change it.
          </p>
          <h2>Cancellation</h2>
          <p>
            Message us on WhatsApp with your order number as soon as you can. Cancellation is easiest before the biryani goes on dum.
          </p>
          <h2>Allergies</h2>
          <p>
            Our kitchen handles wheat, dairy, nuts, eggs and meat. If you have an allergy, tell us in the order note and on WhatsApp before you rely on an order. We cannot guarantee an allergen-free kitchen.
          </p>
          <h2>This website</h2>
          <p>
            Menu photos show the style of food we cook. The portion you receive is packed for delivery. The site may store your cart in your browser, as described in the privacy policy.
          </p>
        </div>
      </section>
    </div>
  );
}
