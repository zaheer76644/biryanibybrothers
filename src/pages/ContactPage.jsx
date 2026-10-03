import { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { pageTitle } from "../config/brand";
import { business } from "../config/business";
import { usePageMeta } from "../hooks/usePageMeta";
import { digitsOnly } from "../utils/validators";
import { whatsappHref } from "../utils/whatsapp";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import WhatsAppIcon from "../components/WhatsAppIcon";

const empty = { name: "", phone: "", message: "" };

export default function ContactPage() {
  usePageMeta({
    title: pageTitle("Contact"),
    description: "Contact Biryani By Brothers in Mira Road. WhatsApp, phone, and opening hours 12 PM to 11 PM.",
  });
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) {
      next.phone = "Enter a 10-digit mobile number.";
    }
    if (form.message.trim().length < 5) next.message = "Write a short message.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
  }

  return (
    <div className="page">
      <PageHero
        eyebrow="Contact"
        title={business.name}
        text="A home kitchen in Mira Road. Message us if you are unsure about delivery."
      />
      <section className="section section--cream">
        <div className="wrap contact">
          <div className="contact__card">
            <h2>Visit the details</h2>
            <ul>
              <li>
                <MapPin aria-hidden="true" />
                <span>
                  <strong>{business.location}</strong>
                  <small>Delivery area: {business.deliveryArea}</small>
                </span>
              </li>
              <li>
                <Clock aria-hidden="true" />
                <span>
                  <strong>Opening hours</strong>
                  <small>{business.hoursDetail}</small>
                </span>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
              </li>
              <li>
                <WhatsAppIcon />
                <a href={whatsappHref("Hello Biryani By Brothers")} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={business.instagramUrl} target="_blank" rel="noreferrer">
                  {business.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="contact__form">
            {sent ? (
              <div className="contact__success" role="status">
                <p className="kicker">Message noted</p>
                <h2>Thank you, {form.name.trim()}.</h2>
                <p>
                  On this preview site your note stays in the browser and is not sent to the kitchen. For a real reply, message us on WhatsApp.
                </p>
                <Button href={whatsappHref(`Hello, this is ${form.name.trim()}. ${form.message.trim()}`)}>
                  Chat on WhatsApp
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2>Send a note</h2>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="field__error">{errors.name}</p>}
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: digitsOnly(event.target.value, 10) })}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="field__error">{errors.phone}</p>}
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    value={form.message}
                    maxLength={500}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <p className="field__error">{errors.message}</p>}
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
