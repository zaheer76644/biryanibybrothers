import Button from "./Button";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../context/CartContext";
import { cartSignature } from "../utils/pricing";

export default function AddToCartControl({
  productId,
  disabled = false,
  variant = "outline",
  className = "",
}) {
  const { items, addToCart, updateQuantity, removeFromCart, maxQty } = useCart();
  const signature = cartSignature({ productId, addOns: [], instructions: "" });
  const line = items.find((item) => item.signature === signature);
  const qty = line?.quantity || 0;

  if (disabled) {
    return (
      <Button variant={variant} className={className} disabled>
        Sold out
      </Button>
    );
  }

  if (qty > 0) {
    return (
      <QuantitySelector
        className={className}
        value={qty}
        min={1}
        max={maxQty}
        allowRemove
        label="Quantity"
        onChange={(next) => {
          if (next < 1) removeFromCart(line.lineId);
          else updateQuantity(line.lineId, next);
        }}
      />
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => addToCart({ productId, quantity: 1 }, { silent: true })}
    >
      Add to Cart
    </Button>
  );
}
