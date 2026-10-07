import { Link } from "react-router-dom";
import FoodImage from "./FoodImage";
import DietBadge from "./DietBadge";
import AddToCartControl from "./AddToCartControl";
import { formatINR } from "../utils/currency";

export default function MenuCard({ item }) {
  const soldOut = item.available === false;
  const pathId = item.slug || item.id;

  return (
    <article className="menu-card">
      <Link to={`/menu/${pathId}`} className="menu-card__media zoom-media">
        <FoodImage src={item.image} alt={item.name} />
        {item.badge && item.badge !== "Veg" && <span className="badge">{item.badge}</span>}
      </Link>
      <div className="menu-card__body">
        <div className="menu-card__top">
          <h3>
            <Link to={`/menu/${pathId}`}>{item.name}</Link>
          </h3>
          <p className="price">{formatINR(item.price)}</p>
        </div>
        <DietBadge diet={item.diet} />
        <p className="menu-card__desc">{item.description}</p>
        {item.trackStock && item.availableStock != null && item.availableStock > 0 && item.availableStock <= 5 && (
          <p className="menu-card__stock">Only {item.availableStock} left</p>
        )}
        <AddToCartControl productId={item.id} disabled={soldOut} />
      </div>
    </article>
  );
}
