import { dumBiryani, story } from "../assets/images";
import { reasons } from "../data/content";
import { pageTitle, seo } from "../config/brand";
import { business } from "../config/business";
import { usePageMeta } from "../hooks/usePageMeta";
import PageHero from "../components/PageHero";
import FoodImage from "../components/FoodImage";
import CTASection from "../components/CTASection";
import DumMeter from "../components/DumMeter";

export default function AboutPage() {
  usePageMeta({
    title: pageTitle("Our Story"),
    description: seo.description,
  });

  return (
    <div className="page">
      <PageHero
        eyebrow={business.location}
        title={business.tagline}
        text="We started with a simple idea — make the kind of biryani we'd happily order for ourselves."
      />
      <section className="section section--cream">
        <div className="wrap story">
          <div className="story__media frame">
            <FoodImage src={story} alt="Biryani handi on the stove in a home kitchen" />
          </div>
          <div className="prose prose--tight">
            <p>
              Two brothers. A home kitchen in Mira Road. One recipe we keep returning to, because a good biryani is mostly patience: marinate, layer, seal, wait.
            </p>
            <p>
              We cook in small batches so the rice is still fragrant when it leaves the kitchen. The chicken is marinated, the basmati is soaked, and the handi is sealed for dum. Nothing here is cooked in a huge pot and held for the evening.
            </p>
            <p>
              It is a local kitchen. We pack it hot and deliver around Mira Road. If something about an order needs a human answer, call or message us — a person in the kitchen will see it.
            </p>
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="wrap about-points">
          {reasons.map((reason) => (
            <article key={reason.n}>
              <span>{reason.n}</span>
              <h2>{reason.title}</h2>
              <p>{reason.text}</p>
            </article>
          ))}
        </div>
        <div className="wrap about-dum">
          <h2>How the dum moves</h2>
          <DumMeter />
        </div>
      </section>
      <section className="section section--cream">
        <div className="wrap story story--reverse">
          <div className="story__media frame">
            <FoodImage src={dumBiryani} alt="Chicken dum biryani in a brass handi" />
          </div>
          <div className="prose prose--tight">
            <h2>What we pay attention to</h2>
            <ul>
              <li>Small-batch cooking, so a box is portioned from a pot we just opened.</li>
              <li>Fresh ingredients for the batch we are cooking that day.</li>
              <li>Dum cooking — layered, sealed, slow.</li>
              <li>A home kitchen in Mira Road, not a central factory.</li>
              <li>Personal attention. If you have a note, we read it before the box is closed.</li>
            </ul>
            <p>Hours are {business.hours}. Delivery covers {business.deliveryArea.toLowerCase()}.</p>
          </div>
        </div>
      </section>
      <CTASection
        title="Hungry?"
        text="The menu is short on purpose. Start with the chicken dum."
        action="Order Biryani"
        to="/menu/chicken-dum-biryani"
      />
    </div>
  );
}
