import { Banknote, Smartphone } from "lucide-react";
import { business } from "../config/business";

export default function PaymentMethod() {
  return (
    <fieldset className="pay-box">
      <legend>Payment method</legend>
      <label className="pay-option is-selected">
        <input type="radio" name="payment" value="cod" defaultChecked />
        <span className="pay-option__icons" aria-hidden="true">
          <Banknote size={18} strokeWidth={1.75} />
          <Smartphone size={18} strokeWidth={1.75} />
        </span>
        <span className="pay-option__copy">
          <strong>{business.paymentLabel}</strong>
          <small>Pay when the biryani arrives</small>
        </span>
        <span className="pay-option__tick" aria-hidden="true" />
      </label>
      <div className="pay-note">
        <p>{business.paymentNote}</p>
        <p>{business.paymentExtra}</p>
      </div>
    </fieldset>
  );
}
