import { Banknote, Smartphone } from "lucide-react";
import { business } from "../config/business";

export default function PaymentMethod({ value = "COD", onChange }) {
  const options = [
    {
      id: "COD",
      label: "Cash on Delivery",
      note: "Pay cash when the biryani arrives",
      icon: <Banknote size={18} strokeWidth={1.75} />,
    },
    {
      id: "UPI",
      label: "UPI on Delivery",
      note: "Pay by UPI when the order is delivered",
      icon: <Smartphone size={18} strokeWidth={1.75} />,
    },
  ];

  return (
    <fieldset className="pay-box">
      <legend>Payment method</legend>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <label key={option.id} className={`pay-option ${selected ? "is-selected" : ""}`}>
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selected}
              onChange={() => onChange?.(option.id)}
            />
            <span className="pay-option__icons" aria-hidden="true">
              {option.icon}
            </span>
            <span className="pay-option__copy">
              <strong>{option.label}</strong>
              <small>{option.note}</small>
            </span>
            <span className="pay-option__tick" aria-hidden="true" />
          </label>
        );
      })}
      <div className="pay-note">
        <p>{business.paymentNote}</p>
        <p>{business.paymentExtra}</p>
      </div>
    </fieldset>
  );
}
