import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import FoodImage from "./FoodImage";
import DietBadge from "./DietBadge";
import AddToCartControl from "./AddToCartControl";
import Ornament from "./Ornament";
import Reveal from "./Reveal";
import { formatINR } from "../utils/currency";

export default function SignatureSection({ featured, items }) {
  if (!featured) return null;

  return (
    <section className="section meet" aria-labelledby="meet-heading">
      <div className="meet__glow" aria-hidden="true" />
      <div className="wrap">
        <header className="meet__head">
          <p className="kicker">Signature</p>
          <h2 id="meet-heading">Meet Your Biryani</h2>
          <Ornament />
          <p className="meet__lead">Slow-cooked. Fragrant. Made fresh in small batches.</p>
        </header>

        <article className="meet-hero">
          <div className="meet-hero__visual">
            <span className="meet-hero__ring" aria-hidden="true" />
            <Link to={`/menu/${featured.id}`} className="meet-hero__photo zoom-media">
              <FoodImage src={featured.image} alt={featured.name} priority />
            </Link>
            {featured.badge && <span className="badge meet-hero__badge">{featured.badge}</span>}
            <div className="meet-hero__plate" aria-hidden="true">
              <Sparkles size={14} />
              House favourite
            </div>
          </div>

          <div className="meet-hero__copy">
            <div className="meet-hero__tags">
              <p className="kicker">The house biryani</p>
              <DietBadge diet={featured.diet} />
            </div>
            <h3>
              <Link to={`/menu/${featured.id}`}>{featured.name}</Link>
            </h3>
            <p className="meet-hero__price">
              <span>{formatINR(featured.price)}</span>
              <small>per box</small>
            </p>
            <p className="meet-hero__desc">{featured.description}</p>
            <ul className="meet-hero__points">
              <li>Dum-cooked</li>
              <li>Small batch</li>
              <li>Mira Road fresh</li>
            </ul>
            <div className="meet-hero__actions">
              <AddToCartControl
                productId={featured.id}
                disabled={featured.available === false}
                variant="primary"
              />
              <Link to={`/menu/${featured.id}`} className="link-arrow">
                Customise <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>

        <div className="meet-rail">
          <div className="meet-rail__head">
            <p className="kicker">Also from the handi</p>
            <Link to="/menu" className="link-arrow">
              Full menu <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="meet-rail__grid">
            {items.map((item, index) => (
              <Reveal key={item.id} delay={index * 70}>
                <article className="meet-card">
                  <span className="meet-card__n" aria-hidden="true">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <Link to={`/menu/${item.id}`} className="meet-card__media zoom-media">
                    <FoodImage src={item.image} alt={item.name} />
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </Link>
                  <div className="meet-card__body">
                    <div className="meet-card__top">
                      <h3>
                        <Link to={`/menu/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="price">{formatINR(item.price)}</p>
                    </div>
                    <DietBadge diet={item.diet} />
                    <p>{item.description}</p>
                    <AddToCartControl
                      productId={item.id}
                      disabled={item.available === false}
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
