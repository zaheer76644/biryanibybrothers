import { deliveryConfig } from "../config/deliveryConfig";
import { formatINR } from "../utils/currency";

export default function OrderSummary({ pricing, action }) {
  const cap = deliveryConfig.freeDeliveryAbove;
  const progress = cap > 0 ? Math.min(100, Math.round((pricing.subtotal / cap) * 100)) : 0;

  return (
    <section className="summary" aria-label="Order summary">
      <h2>Your order</h2>
      <div className="summary__row">
        <span>Subtotal</span>
        <span>{formatINR(pricing.subtotal)}</span>
      </div>
      {pricing.discount > 0 && (
        <div className="summary__row">
          <span>Discount</span>
          <span>− {formatINR(pricing.discount)}</span>
        </div>
      )}
      <div className="summary__row">
        <span>Delivery</span>
        <span>{pricing.subtotal === 0 ? formatINR(0) : pricing.delivery === 0 ? "Free" : formatINR(pricing.delivery)}</span>
      </div>
      <div className="summary__row summary__row--total">
        <span>Total</span>
        <span>{formatINR(pricing.total)}</span>
      </div>

      {pricing.subtotal > 0 && (
        <div className={`hint ${pricing.freeDelivery ? "is-ok" : ""}`}>
          <div
            className="hint__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={cap}
            aria-valuenow={Math.min(pricing.subtotal, cap)}
            aria-label="Progress toward free delivery"
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          {pricing.freeDelivery ? (
            <p>Free delivery on this order.</p>
          ) : (
            <p>You are {formatINR(pricing.awayFromFree)} away from free delivery.</p>
          )}
          <p className="hint__meta">Free delivery above {formatINR(cap)}.</p>
        </div>
      )}

      {pricing.shortOfMinimum > 0 && (
        <p className="field__error" role="alert">
          Add {formatINR(pricing.shortOfMinimum)} more to reach the {formatINR(deliveryConfig.minimumOrder)} minimum.
        </p>
      )}

      {action}
    </section>
  );
}
