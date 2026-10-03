import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FoodImage from "./FoodImage";

export default function StorySection({ image, alt }) {
  return (
    <section className="section section--cream">
      <div className="wrap story">
        <div className="story__media frame zoom-media">
          <FoodImage src={image} alt={alt} />
        </div>
        <div className="story__copy">
          <p className="kicker">Our Story</p>
          <h2>Started by two brothers with one simple obsession — making biryani worth coming back for.</h2>
          <p>
            A home kitchen in Mira Road. Small batches. One recipe we keep cooking because we would order it ourselves.
          </p>
          <Link to="/about" className="link-arrow">
            Read Our Story <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
