import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, MapPinned, NotebookPen, UserRound } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCatalog } from "../context/CatalogContext";
import { digitsOnly, validateCustomer } from "../utils/validators";
import { formatINR } from "../utils/currency";
import * as addressService from "../services/addressService";
import * as orderService from "../services/orderService";
import * as couponService from "../services/couponService";
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

function emptyForm(user) {
  return {
    fullName: user?.name || "",
    mobile: user?.mobile || "",
    flat: "",
    building: "",
    area: "Mira Road",
    pincode: "",
    instructions: "",
    confirmed: false,
    paymentMethod: "COD",
    couponCode: "",
  };
}

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, pricing, clearCart, getCartCount, notify } = useCart();
  const { user, refreshUser } = useAuth();
  const { settings } = useCatalog();
  const [form, setForm] = useState(() => emptyForm(user));
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const idempotencyKey = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `bbb-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const hadItems = useRef(getCartCount() > 0);

  useEffect(() => {
    if (!hadItems.current) navigate("/cart", { replace: true });
  }, [navigate]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user?.name || "",
      mobile: prev.mobile || user?.mobile || "",
    }));
  }, [user]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await addressService.fetchAddresses();
        if (!active) return;
        setAddresses(rows || []);
        const def = (rows || []).find((a) => a.isDefault) || rows?.[0];
        if (def) applyAddress(def);
      } catch {
        // addresses optional on first checkout
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function applyAddress(address) {
    setSelectedAddressId(address._id);
    setForm((prev) => ({
      ...prev,
      fullName: address.fullName,
      mobile: address.mobile,
      flat: address.flatHouse,
      building: address.buildingSociety,
      area: address.area,
      pincode: address.pincode,
      instructions: address.landmark || prev.instructions,
    }));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setSelectedAddressId("");
    if (name === "mobile") setForm((prev) => ({ ...prev, mobile: digitsOnly(value, 10) }));
    else if (name === "pincode") setForm((prev) => ({ ...prev, pincode: digitsOnly(value, 6) }));
    else if (type === "checkbox") setForm((prev) => ({ ...prev, [name]: checked }));
    else setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function applyCoupon() {
    setCouponMsg("");
    setCouponDiscount(0);
    if (!form.couponCode.trim()) return;
    try {
      const result = await couponService.validateCoupon({
        code: form.couponCode.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedAddOns: item.addOns,
        })),
      });
      setCouponDiscount(result.discount || 0);
      setCouponMsg(`Coupon applied: −${formatINR(result.discount)}`);
    } catch (err) {
      setCouponMsg(err.message || "Invalid coupon.");
    }
  }

  async function saveCurrentAddress() {
    const payload = {
      label: "HOME",
      fullName: form.fullName,
      mobile: form.mobile,
      flatHouse: form.flat,
      buildingSociety: form.building,
      area: form.area,
      landmark: "",
      pincode: form.pincode,
      isDefault: addresses.length === 0,
    };
    const rows = await addressService.createAddress(payload);
    setAddresses(rows);
    await refreshUser();
    notify("Address saved");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateCustomer({
      fullName: form.fullName,
      mobile: form.mobile,
      flat: form.flat,
      building: form.building,
      area: form.area,
      pincode: form.pincode,
      confirmed: form.confirmed,
    });
    if (items.length === 0) nextErrors.form = "Your box is empty.";
    if (pricing.shortOfMinimum > 0) {
      nextErrors.minimum = `Add ${formatINR(pricing.shortOfMinimum)} more to reach the ${formatINR(pricing.minimumOrder)} minimum.`;
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
    try {
      const result = await orderService.placeOrder({
        deliveryAddress: {
          fullName: form.fullName,
          mobile: form.mobile,
          flatHouse: form.flat,
          buildingSociety: form.building,
          area: form.area,
          landmark: "",
          pincode: form.pincode,
          instructions: form.instructions,
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedAddOns: (item.addOns || []).map((a) => ({
            id: a.id,
            name: a.name,
          })),
        })),
        couponCode: form.couponCode || undefined,
        paymentMethod: form.paymentMethod === "UPI" ? "UPI_ON_DELIVERY" : "COD",
        customerNotes: form.instructions,
        idempotencyKey: idempotencyKey.current,
      });

      clearCart();
      navigate(`/order-confirmation/${result.orderId}`, {
        state: {
          order: result,
          whatsapp: result.whatsapp,
        },
      });
    } catch (err) {
      if (err.status === 401) {
        notify("Session expired. Please login again.");
        navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
        return;
      }
      setErrors({ form: err.message || "Could not place order." });
    } finally {
      setSubmitting(false);
    }
  }

  const youFields = fields.filter((field) => field.group === "you");
  const addressFields = fields.filter((field) => field.group === "address");
  const displayTotal = Math.max(0, pricing.total - couponDiscount);

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
                value={form[field.id]}
                onChange={handleChange}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                aria-invalid={Boolean(errors[field.id])}
                required
              />
              {errors[field.id] && <p className="field__error">{errors[field.id]}</p>}
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

        {addresses.length > 0 && (
          <div className="saved-addresses">
            <p className="kicker">Deliver to</p>
            <div className="saved-addresses__list">
              {addresses.map((address) => (
                <button
                  key={address._id}
                  type="button"
                  className={`saved-address ${selectedAddressId === address._id ? "is-active" : ""}`}
                  onClick={() => applyAddress(address)}
                >
                  <strong>{address.label}</strong>
                  <span>
                    {address.flatHouse}, {address.buildingSociety}, {address.area}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-grid">
          {addressFields.map((field) => (
            <div className="field" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                value={form[field.id]}
                onChange={handleChange}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                placeholder={field.placeholder || ""}
                aria-invalid={Boolean(errors[field.id])}
                required
              />
              {errors[field.id] && <p className="field__error">{errors[field.id]}</p>}
            </div>
          ))}
          <div className="field field--full">
            <label htmlFor="instructions">
              <NotebookPen size={14} aria-hidden="true" /> Delivery instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              maxLength={200}
              placeholder="Gate code, floor, or a landmark."
            />
          </div>
        </div>
        <button type="button" className="quiet-link" onClick={saveCurrentAddress}>
          Save this address
        </button>
      </section>

      <section className="checkout-card">
        <header className="checkout-card__head">
          <div>
            <p className="kicker">Coupon</p>
            <h2>Have a code?</h2>
          </div>
        </header>
        <div className="coupon-row">
          <input
            name="couponCode"
            value={form.couponCode}
            onChange={handleChange}
            placeholder="Enter coupon code"
            aria-label="Coupon code"
          />
          <Button type="button" variant="outline" onClick={applyCoupon}>
            Apply
          </Button>
        </div>
        {couponMsg && <p className="coupon-msg">{couponMsg}</p>}
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
        <PaymentMethod
          value={form.paymentMethod}
          onChange={(paymentMethod) => setForm((prev) => ({ ...prev, paymentMethod }))}
        />
        <label className="confirm-check">
          <input
            id="confirmed"
            name="confirmed"
            type="checkbox"
            checked={form.confirmed}
            onChange={handleChange}
            aria-invalid={Boolean(errors.confirmed)}
          />
          <span>I confirm that the above delivery details are correct.</span>
        </label>
        {errors.confirmed && <p className="field__error">{errors.confirmed}</p>}
      </section>

      <div className="checkout-form__foot">
        <p>
          Estimated delivery{" "}
          <strong>
            {settings?.estimatedDeliveryTime?.min || 30}–{settings?.estimatedDeliveryTime?.max || 45} minutes
          </strong>
        </p>
        <Button type="submit" className="checkout-form__submit" disabled={submitting}>
          {submitting ? "Placing order…" : `Place Order · ${formatINR(displayTotal)}`}
        </Button>
      </div>
    </form>
  );
}
