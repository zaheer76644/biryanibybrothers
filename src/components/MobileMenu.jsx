import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFocusTrap } from "../hooks/useFocusTrap";
import Button from "./Button";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

export default function MobileMenu() {
  const { isNavOpen, closeNav } = useCart();
  const ref = useFocusTrap(isNavOpen);

  return (
    <div
      ref={ref}
      className={`mobile-menu ${isNavOpen ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
      tabIndex={-1}
      inert={!isNavOpen}
      aria-hidden={!isNavOpen}
    >
      <div className="mobile-menu__top">
        <p className="kicker is-light">Biryani By Brothers</p>
        <button type="button" className="icon-btn" onClick={closeNav} aria-label="Close menu">
          <X size={22} />
        </button>
      </div>
      <nav aria-label="Mobile">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} onClick={closeNav}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Button to="/menu" onClick={closeNav}>
        Order Now
      </Button>
    </div>
  );
}
