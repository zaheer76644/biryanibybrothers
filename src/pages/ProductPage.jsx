import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAddOns, getMenuItem } from "../data/menu";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";
import FoodImage from "../components/FoodImage";
import Button from "../components/Button";
import QuantitySelector from "../components/QuantitySelector";
import AddOnSelector from "../components/AddOnSelector";
import Modal from "../components/Modal";

export default function ProductPage() {
  const { itemId } = useParams();
  const item = getMenuItem(itemId);
  const { addToCart, maxQty } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [zoom, setZoom] = useState(false);

  usePageMeta({
    title: item ? pageTitle(item.name) : pageTitle("Menu"),
    description: item?.description || "Biryani from Biryani By Brothers in Mira Road.",
  });

  useEffect(() => {
    setQty(1);
    setSelected([]);
    setInstructions("");
    setZoom(false);
  }, [itemId]);

  useEffect(() => {
    document.body.classList.toggle("scroll-lock-modal", zoom);
    return () => document.body.classList.remove("scroll-lock-modal");
  }, [zoom]);

  if (!item) {
    return (
      <div className="page empty">
        <p className="kicker">Missing from the handi</p>
        <h1>This dish isn’t on the menu.</h1>
        <Button to="/menu">Explore Menu</Button>
      </div>
    );
  }

  const addOns = item.allowAddOns ? getAddOns() : [];
  const extra = selected.reduce((sum, id) => sum + (getMenuItem(id)?.price || 0), 0);
  const total = (item.price + extra) * qty;
  const soldOut = item.available === false;

  function toggle(id) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  function add() {
    if (soldOut) return;
    addToCart({
      productId: item.id,
      quantity: qty,
      instructions,
      addOns: selected
        .map((id) => getMenuItem(id))
        .filter(Boolean)
        .map((addon) => ({ id: addon.id, name: addon.name, price: addon.price })),
    });
  }

  return (
    <div className="page product-page">
      <div className="wrap product">
        <div>
          <Link to="/menu" className="link-arrow product__back">
            <ArrowLeft size={18} aria-hidden="true" /> Back to menu
          </Link>
          <button
            type="button"
            className="food-frame product__zoom"
            onClick={() => item.image && setZoom(true)}
            aria-label={item.image ? `View a larger photo of ${item.name}` : item.name}
          >
            <FoodImage src={item.image} alt={item.name} priority />
          </button>
        </div>
        <div className="product__info">
          {item.badge && <span className="badge">{item.badge}</span>}
          <h1>{item.name}</h1>
          <p className="product__price">{formatINR(item.price)}</p>
          <p className="product__desc">{item.description}</p>

          <div className="product__qty">
            <span id="qty-label">Quantity</span>
            <QuantitySelector
              value={qty}
              max={maxQty}
              onChange={setQty}
              label={`Quantity for ${item.name}`}
            />
          </div>

          <AddOnSelector addOns={addOns} selected={selected} onToggle={toggle} />

          <div className="field">
            <label htmlFor="special">Special instructions</label>
            <textarea
              id="special"
              value={instructions}
              maxLength={200}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Less spicy, extra mint, call when you arrive."
            />
          </div>

          <div className="product__desktop-add">
            <Button onClick={add} disabled={soldOut}>
              {soldOut ? "Sold out" : `Add to Cart · ${formatINR(total)}`}
            </Button>
          </div>
        </div>
      </div>

      <div className="product-bar">
        <p>
          <strong>{formatINR(total)}</strong>
          <span>
            {qty} × {item.name}
          </span>
        </p>
        <Button onClick={add} disabled={soldOut}>
          {soldOut ? "Sold out" : "Add to Cart"}
        </Button>
      </div>

      <Modal open={zoom} title={item.name} onClose={() => setZoom(false)}>
        <img src={item.image} alt={item.name} />
      </Modal>
    </div>
  );
}
