import { CookingPot, Flame, Heart, MapPin } from "lucide-react";
import { dumBiryani, heroBiryani, story } from "../assets/images";
import { reasons } from "../data/content";
import { getMainItems, getMenuItem } from "../data/menu";
import { reviews } from "../data/reviews";
import { todaysBatch } from "../config/business";
import { seo } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import FoodCard from "../components/FoodCard";
import StorySection from "../components/StorySection";
import ProcessSection from "../components/ProcessSection";
import ReviewCard from "../components/ReviewCard";
import CTASection from "../components/CTASection";
import DumMeter from "../components/DumMeter";
import FoodImage from "../components/FoodImage";
import Button from "../components/Button";
import Reveal from "../components/Reveal";

const whyIcons = [CookingPot, Flame, Heart, MapPin];

export default function HomePage() {
  usePageMeta({ title: seo.title, description: seo.description });
  const featured = getMenuItem("chicken-dum-biryani");
  const others = getMainItems().filter((item) => item.id !== featured?.id);
  const batchWidth = Math.min(100, Math.round((todaysBatch.available / todaysBatch.capacity) * 100));

  return (
    <div className="page">
      <HeroSection image={heroBiryani} featured={featured} />

      <section className="section section--cream">
        <div className="wrap">
          <SectionHeading
            eyebrow="Signature"
            title="Meet Your Biryani"
            text="Slow-cooked. Fragrant. Made fresh in small batches."
          />
          {featured && <FoodCard item={featured} featured />}
          <div className="food-grid">
            {others.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap">
          <SectionHeading light eyebrow="The kitchen" title="Why Brothers?" />
          <div className="why-grid">
            {reasons.map((reason, index) => {
              const Icon = whyIcons[index];
              return (
                <Reveal key={reason.n} delay={index * 60}>
                  <article className="why-card">
                    <span>{reason.n}</span>
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <StorySection
        image={story}
        alt="A brass handi sealed with dough, cooking on a home stove"
      />

      <section className="section section--dark handi">
        <div className="wrap handi__grid">
          <div className="handi__copy">
            <p className="kicker is-light">Open the handi</p>
            <h2>The lid stays shut until the rice is ready.</h2>
            <p>
              We seal the pot and let the steam do the work. That is the dum. When it opens, the biryani should smell like it has been waiting for you.
            </p>
            <DumMeter />
          </div>
          <div className="frame handi__media zoom-media">
            <FoodImage src={dumBiryani} alt="Dum biryani in a dough-sealed brass handi" />
          </div>
        </div>
      </section>

      <ProcessSection />

      <section className="section section--cream">
        <div className="wrap">
          <SectionHeading
            eyebrow="From the table"
            title="Reviews will live here."
            text="These cards are placeholders for real customer notes. Nothing below is a genuine review."
          />
          <div className="reviews">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--charcoal batch">
        <div className="wrap batch__inner">
          <p className="kicker is-light">Today’s batch</p>
          <h2>Today’s Batch</h2>
          <p className="batch__lead">Freshly prepared in limited quantities.</p>
          <p className="batch__count">
            <strong>{todaysBatch.available}</strong>
            <span>boxes available</span>
          </p>
          <div
            className="batch__meter"
            role="img"
            aria-label={`${todaysBatch.available} of ${todaysBatch.capacity} boxes available`}
          >
            <span style={{ width: `${batchWidth}%` }} />
          </div>
          <p className="batch__ratio">
            Today’s batch: {todaysBatch.available} / {todaysBatch.capacity}
          </p>
          <Button to="/menu">Order Today’s Batch</Button>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
