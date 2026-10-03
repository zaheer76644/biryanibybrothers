import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
      <div className="dock">
        <p>
          <strong>
            {count} {count === 1 ? "item" : "items"}
          </strong>
          <span>{formatINR(pricing.total)}</span>
        </p>
        <Button onClick={openDrawer}>View Cart</Button>
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
