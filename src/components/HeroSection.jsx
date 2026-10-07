import Button from "./Button";
import FoodImage from "./FoodImage";
import TrustBadges from "./TrustBadges";
import { formatINR } from "../utils/currency";

export default function HeroSection({ image, featured }) {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div className="hero__media frame">
          <FoodImage
            src={image}
            alt="Chicken dum biryani in a brass handi, with steam rising"
            priority
          />
          <div className="steam" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero__float">
            {featured?.badge && <span className="badge">{featured.badge}</span>}
            <p className="hero__float-name">{featured?.name}</p>
            <p className="hero__float-price">{featured ? formatINR(featured.price) : ""}</p>
          </div>
        </div>
        <div className="hero__copy">
          <p className="kicker is-light">Mira Road · Small batch</p>
          <h1>
            <span>From Our Handi</span>
            <span>to Your Heart.</span>
          </h1>
          <p className="lede">
            Small-batch veg and non-veg biryani, dum-cooked with love and served fresh in Mira Road.
          </p>
          <div className="hero__actions">
            <Button to="/menu/chicken-dum-biryani">Order Biryani</Button>
            <Button to="/menu" variant="secondary">
              Explore Menu
            </Button>
          </div>
          <TrustBadges />
        </div>
      </div>
    </section>
  );
}
