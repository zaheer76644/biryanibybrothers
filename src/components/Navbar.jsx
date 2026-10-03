import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { mark } from "../assets/images";
import { useCart } from "../context/CartContext";
import Button from "./Button";
import MobileMenu from "./MobileMenu";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount, openDrawer, isNavOpen, openNav, closeNav } = useCart();
  const count = getCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="nav__inner">
        <button
          type="button"
          className="icon-btn nav__burger"
          aria-label={isNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={isNavOpen}
          onClick={() => (isNavOpen ? closeNav() : openNav())}
        >
          {isNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="nav__brand" aria-label="Biryani By Brothers, home">
          <img src={mark} alt="" width="48" height="48" />
          <span>
            <strong>Biryani By Brothers</strong>
            <small>Two Brothers. One Recipe.</small>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={openDrawer}
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag size={20} />
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
          <Button to="/menu" className="nav__order">
            Order Now
          </Button>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
}
