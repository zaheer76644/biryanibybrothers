import { Trash2 } from "lucide-react";
import FoodImage from "./FoodImage";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart, maxQty } = useCart();

  return (
    <article className="cart-item">
      <div className="cart-item__media">
        <FoodImage src={item.image} alt="" />
      </div>
      <div className="cart-item__body">
        <div className="cart-item__top">
          <h3>
            {item.name} <span>× {item.quantity}</span>
          </h3>
          <p className="price">{formatINR(item.price * item.quantity)}</p>
        </div>
        {item.addOns?.length > 0 && (
          <ul className="cart-item__addons">
            {item.addOns.map((addon) => (
              <li key={addon.id}>
                <span>
                  {addon.name} × {item.quantity}
                </span>
                <span>{formatINR(addon.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        )}
        {item.instructions && <p className="cart-item__note">“{item.instructions}”</p>}
        <div className="cart-item__controls">
          <QuantitySelector
            value={item.quantity}
            max={maxQty}
            label={`Quantity for ${item.name}`}
            onChange={(quantity) => updateQuantity(item.lineId, quantity)}
          />
          <button
            type="button"
            className="text-btn"
            onClick={() => removeFromCart(item.lineId)}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 size={16} aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
