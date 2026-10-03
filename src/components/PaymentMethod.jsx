import { business } from "../config/business";

export default function PaymentMethod() {
  return (
    <fieldset className="pay-box">
      <legend>Payment method</legend>
      <label className="pay-option">
        <input type="radio" name="payment" value="cod" defaultChecked />
        <span>{business.paymentLabel}</span>
      </label>
      <div className="pay-note">
        <p>{business.paymentNote}</p>
        <p>{business.paymentExtra}</p>
      </div>
    </fieldset>
  );
}
