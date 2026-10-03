import { Link } from "react-router-dom";
import Button from "./Button";
import FoodImage from "./FoodImage";
import DietBadge from "./DietBadge";
import { formatINR } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const soldOut = item.available === false;

  return (
    <article className="menu-card">
      <Link to={`/menu/${item.id}`} className="menu-card__media zoom-media">
        <FoodImage src={item.image} alt={item.name} />
        {item.badge && item.badge !== "Veg" && <span className="badge">{item.badge}</span>}
      </Link>
      <div className="menu-card__body">
        <div className="menu-card__top">
          <h3>
            <Link to={`/menu/${item.id}`}>{item.name}</Link>
          </h3>
          <p className="price">{formatINR(item.price)}</p>
        </div>
        <DietBadge diet={item.diet} />
        <p className="menu-card__desc">{item.description}</p>
        <Button
          variant="outline"
          onClick={() => addToCart({ productId: item.id, quantity: 1 })}
          disabled={soldOut}
        >
          {soldOut ? "Sold out" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}
