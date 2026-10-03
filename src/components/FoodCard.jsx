import { Link } from "react-router-dom";
import FoodImage from "./FoodImage";
import AddToCartControl from "./AddToCartControl";
import { formatINR } from "../utils/currency";

export default function FoodCard({ item, featured = false }) {
  const soldOut = item.available === false;

  if (featured) {
    return (
      <article className="feature">
        <Link to={`/menu/${item.id}`} className="feature__media zoom-media">
          <FoodImage src={item.image} alt={item.name} priority />
          {item.badge && <span className="badge">{item.badge}</span>}
        </Link>
        <div className="feature__body">
          <p className="kicker">The house biryani</p>
          <h3>
            <Link to={`/menu/${item.id}`}>{item.name}</Link>
          </h3>
          <p className="feature__price">{formatINR(item.price)}</p>
          <p>{item.description}</p>
          <div className="feature__actions">
            <AddToCartControl productId={item.id} disabled={soldOut} variant="primary" />
            <Link to={`/menu/${item.id}`} className="link-arrow">
              Customise
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="food-card">
      <Link to={`/menu/${item.id}`} className="food-card__media zoom-media">
        <FoodImage src={item.image} alt={item.name} />
        {item.badge && <span className="badge">{item.badge}</span>}
      </Link>
      <div className="food-card__body">
        <div className="food-card__top">
          <h3>
            <Link to={`/menu/${item.id}`}>{item.name}</Link>
          </h3>
          <p className="price">{formatINR(item.price)}</p>
        </div>
        <p>{item.description}</p>
        <AddToCartControl productId={item.id} disabled={soldOut} />
      </div>
    </article>
  );
}
