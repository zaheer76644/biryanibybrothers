import { pageTitle } from "../config/brand";
import { business } from "../config/business";
import { usePageMeta } from "../hooks/usePageMeta";
import PageHero from "../components/PageHero";

export default function PrivacyPage() {
  usePageMeta({
    title: pageTitle("Privacy Policy"),
    description: "How Biryani By Brothers handles the details you type into this website.",
  });

  return (
    <div className="page">
      <PageHero eyebrow="Privacy" title="Privacy Policy" text="Last updated 3 October 2026." />
      <section className="section section--cream">
        <div className="wrap prose">
          <p>
            {business.name} is a home kitchen in {business.location}. This page explains what the website does with the details you enter.
          </p>
          <h2>What you can type in</h2>
          <p>
            Checkout asks for your name, mobile number, flat, building, area, pincode and an optional delivery note. The contact form asks for a name, phone number and message.
          </p>
          <h2>Where it is stored right now</h2>
          <p>
            This is a static website. Your cart, delivery draft and last order are saved in your browser’s local storage so a refresh does not empty the box. They are not sent to a server. The contact form does not transmit your message anywhere yet — it only shows a confirmation on this device.
          </p>
          <h2>Payments</h2>
          <p>
            We do not collect card numbers or UPI IDs on this website. Orders are paid by cash or UPI when they are delivered.
          </p>
          <h2>WhatsApp and Instagram</h2>
          <p>
            Links to WhatsApp and Instagram leave this website. Those services have their own privacy policies. A WhatsApp link may include your order number or the text of a message you chose to send.
          </p>
          <h2>How long it stays</h2>
          <p>
            Browser storage stays until you clear it, or until you place an order and the cart is emptied. You can clear site data from your browser settings at any time.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about an order are fastest on WhatsApp or by phone during {business.hours}.
          </p>
        </div>
      </section>
    </div>
  );
}
