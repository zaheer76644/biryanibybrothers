import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { logo } from "../assets/images";
import { business } from "../config/business";
import { whatsappHref } from "../utils/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img src={logo} alt="Biryani By Brothers" />
          <p>{business.tagline}</p>
          <p className="footer__tagline-heart">{business.taglineHeart}</p>
        </div>
        <div>
          <h2>Quick links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h2>Order</h2>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
          <h2 className="footer__sub">Follow us</h2>
          <ul>
            <li>
              <a href={business.instagramUrl} target="_blank" rel="noreferrer">
                <Instagram size={16} aria-hidden="true" /> {business.instagramHandle}
              </a>
            </li>
            <li>
              <a href={whatsappHref("Hello Biryani By Brothers")} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul className="footer__contact">
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>{business.location}</span>
            </li>
            <li>
              <Clock size={16} aria-hidden="true" />
              <span>{business.hours}</span>
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">
        <div className="wrap footer__bar-inner">
          <p>© 2026 Biryani By Brothers</p>
          <p>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
