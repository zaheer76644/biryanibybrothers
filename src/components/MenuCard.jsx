import { Link } from "react-router-dom";
import Button from "./Button";
import FoodImage from "./FoodImage";
import { formatINR } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const soldOut = item.available === false;

  return (
    <article className="menu-card">
      <Link to={`/menu/${item.id}`} className="menu-card__media zoom-media">
        <FoodImage src={item.image} alt={item.name} />
        {item.badge && <span className="badge">{item.badge}</span>}
      </Link>
      <div className="menu-card__body">
        <div className="menu-card__title">
          <h3>
            <Link to={`/menu/${item.id}`}>{item.name}</Link>
          </h3>
          <span className="menu-card__rule" aria-hidden="true" />
          <p className="price">{formatINR(item.price)}</p>
        </div>
        <p>{item.description}</p>
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
