import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";
import Button from "./Button";

export default function MobileDock() {
  const { pathname } = useLocation();
  const { getCartCount, pricing, openDrawer } = useCart();
  const count = getCartCount();
  const [pastHero, setPastHero] = useState(false);
  const hide =
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/order-confirmation" ||
    /^\/menu\/.+/.test(pathname);

  useEffect(() => {
    if (pathname !== "/") return undefined;
    const onScroll = () => setPastHero(window.scrollY > 540);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const showCart = !hide && count > 0;
  const showOrder = !hide && count === 0 && pathname === "/" && pastHero;

  useEffect(() => {
    document.body.classList.toggle("has-dock", showCart || showOrder);
    return () => document.body.classList.remove("has-dock");
  }, [showCart, showOrder]);

  if (showCart) {
    return (
      <div className="dock dock--cart">
        <button type="button" className="dock__pill" onClick={openDrawer}>
          <span className="dock__count" aria-hidden="true">
            {count}
          </span>
          <span className="dock__info">
            <strong>{formatINR(pricing.total)}</strong>
            <small>
              {pricing.freeDelivery
                ? "Free delivery unlocked"
                : `${formatINR(pricing.awayFromFree)} more for free delivery`}
            </small>
          </span>
          <span className="dock__go">
            Cart
            <ChevronRight size={16} aria-hidden="true" />
          </span>
        </button>
      </div>
    );
  }

  if (showOrder) {
    return (
      <div className="dock dock--single">
        <Button to="/menu" className="dock__full">
          Order Now
        </Button>
      </div>
    );
  }

  return null;
}
