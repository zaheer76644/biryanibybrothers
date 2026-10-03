import { faqs } from "../data/faq";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import PageHero from "../components/PageHero";
import Accordion from "../components/Accordion";
import CTASection from "../components/CTASection";

export default function FaqPage() {
  usePageMeta({
    title: pageTitle("FAQ"),
    description: "Delivery, cash, UPI, timings and order questions for Biryani By Brothers in Mira Road.",
  });

  return (
    <div className="page">
      <PageHero
        eyebrow="FAQ"
        title="Before you order."
        text="Short answers. If yours is not here, WhatsApp us."
      />
      <section className="section section--cream">
        <div className="wrap faq-wrap">
          <Accordion items={faqs} />
        </div>
      </section>
      <CTASection />
    </div>
  );
}
