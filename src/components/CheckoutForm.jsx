import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, MapPinned, NotebookPen, UserRound } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { deliveryConfig } from "../config/deliveryConfig";
import { digitsOnly, validateCustomer } from "../utils/validators";
import { formatINR } from "../utils/currency";
import Button from "./Button";
import PaymentMethod from "./PaymentMethod";

const fields = [
  { id: "fullName", label: "Full Name", autoComplete: "name", group: "you" },
  { id: "mobile", label: "Mobile Number", autoComplete: "tel", inputMode: "numeric", group: "you" },
  { id: "flat", label: "Flat / House Number", autoComplete: "address-line2", group: "address" },
  { id: "building", label: "Building / Society", autoComplete: "address-line1", group: "address" },
  { id: "area", label: "Area", autoComplete: "address-level2", placeholder: "Mira Road", group: "address" },
  { id: "pincode", label: "Pincode", autoComplete: "postal-code", inputMode: "numeric", group: "address" },
];

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, pricing, clearCart, getCartCount } = useCart();
  const { customer, updateCustomer, placeOrder } = useOrder();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const hadItems = useRef(getCartCount() > 0);

  useEffect(() => {
    if (!hadItems.current) navigate("/cart", { replace: true });
  }, [navigate]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    if (name === "mobile") updateCustomer({ mobile: digitsOnly(value, 10) });
    else if (name === "pincode") updateCustomer({ pincode: digitsOnly(value, 6) });
    else if (type === "checkbox") updateCustomer({ [name]: checked });
    else updateCustomer({ [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateCustomer(customer);
    if (items.length === 0) nextErrors.form = "Your box is empty.";
    if (pricing.shortOfMinimum > 0) {
      nextErrors.minimum = `Add ${formatINR(pricing.shortOfMinimum)} more to reach the ${formatINR(deliveryConfig.minimumOrder)} minimum.`;
    }
    setErrors(nextErrors);
    const firstField = fields.find((field) => nextErrors[field.id]);
    if (firstField) {
      document.getElementById(firstField.id)?.focus();
      return;
    }
    if (nextErrors.confirmed) {
      document.getElementById("confirmed")?.focus();
      return;
    }
    if (nextErrors.minimum || nextErrors.form) return;

    setSubmitting(true);
    const order = placeOrder({ items, pricing });
    clearCart();
    navigate("/order-confirmation", { state: { order } });
  }

  const youFields = fields.filter((field) => field.group === "you");
  const addressFields = fields.filter((field) => field.group === "address");

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      {(errors.form || errors.minimum) && (
        <p className="field__error checkout-form__alert" role="alert">
          {errors.form || errors.minimum}
        </p>
      )}

      <section className="checkout-card">
        <header className="checkout-card__head">
          <span className="checkout-card__icon" aria-hidden="true">
            <UserRound size={18} />
          </span>
          <div>
            <p className="kicker">Step 01</p>
            <h2>Who’s ordering?</h2>
          </div>
        </header>
        <div className="form-grid">
          {youFields.map((field) => (
            <div className="field" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                value={customer[field.id]}
                onChange={handleChange}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                aria-invalid={Boolean(errors[field.id])}
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                required
              />
              {errors[field.id] && (
                <p id={`${field.id}-error`} className="field__error">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="checkout-card">
        <header className="checkout-card__head">
          <span className="checkout-card__icon" aria-hidden="true">
            <MapPinned size={18} />
          </span>
          <div>
            <p className="kicker">Step 02</p>
            <h2>Where should the handi go?</h2>
          </div>
        </header>
        <div className="form-grid">
          {addressFields.map((field) => (
            <div className="field" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                value={customer[field.id]}
                onChange={handleChange}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                placeholder={field.placeholder || ""}
                aria-invalid={Boolean(errors[field.id])}
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                required
              />
              {errors[field.id] && (
                <p id={`${field.id}-error`} className="field__error">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
          <div className="field field--full">
            <label htmlFor="instructions">
              <NotebookPen size={14} aria-hidden="true" /> Delivery instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={customer.instructions}
              onChange={handleChange}
              maxLength={200}
              placeholder="Gate code, floor, or a landmark."
            />
          </div>
        </div>
      </section>

      <section className="checkout-card">
        <header className="checkout-card__head">
          <span className="checkout-card__icon" aria-hidden="true">
            <Bike size={18} />
          </span>
          <div>
            <p className="kicker">Step 03</p>
            <h2>Pay on delivery</h2>
          </div>
        </header>
        <PaymentMethod />
        <label className="confirm-check">
          <input
            id="confirmed"
            name="confirmed"
            type="checkbox"
            checked={customer.confirmed}
            onChange={handleChange}
            aria-invalid={Boolean(errors.confirmed)}
          />
          <span>I confirm that the above delivery details are correct.</span>
        </label>
        {errors.confirmed && <p className="field__error">{errors.confirmed}</p>}
      </section>

      <div className="checkout-form__foot">
        <p>
          Estimated delivery <strong>30–45 minutes</strong>
        </p>
        <Button type="submit" className="checkout-form__submit" disabled={submitting}>
          {submitting ? "Placing order…" : `Place Order · ${formatINR(pricing.total)}`}
        </Button>
      </div>
    </form>
  );
}
