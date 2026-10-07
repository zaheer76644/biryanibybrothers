import { useEffect, useState } from "react";
import * as addressService from "../services/addressService";
import { digitsOnly } from "../utils/validators";
import Button from "../components/Button";
import Loader from "../components/Loader";

const empty = {
  label: "HOME",
  fullName: "",
  mobile: "",
  flatHouse: "",
  buildingSociety: "",
  area: "Mira Road",
  landmark: "",
  pincode: "",
  isDefault: false,
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const rows = await addressService.fetchAddresses();
    setAddresses(rows || []);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await load();
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        mobile: digitsOnly(form.mobile, 10),
        pincode: digitsOnly(form.pincode, 6),
      };
      const rows = editingId
        ? await addressService.updateAddress(editingId, payload)
        : await addressService.createAddress(payload);
      setAddresses(rows);
      setForm(empty);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading addresses…" />;

  return (
    <section className="account-panel">
      <h2>Saved Addresses</h2>
      {error && <p className="field__error">{error}</p>}

      <ul className="address-list">
        {addresses.map((address) => (
          <li key={address._id}>
            <div>
              <strong>
                {address.label}
                {address.isDefault ? " · Default" : ""}
              </strong>
              <p>
                {address.fullName} · {address.mobile}
                <br />
                {address.flatHouse}, {address.buildingSociety}, {address.area}
                <br />
                {address.pincode}
              </p>
            </div>
            <div className="address-list__actions">
              <button
                type="button"
                onClick={() => {
                  setEditingId(address._id);
                  setForm({
                    label: address.label,
                    fullName: address.fullName,
                    mobile: address.mobile,
                    flatHouse: address.flatHouse,
                    buildingSociety: address.buildingSociety,
                    area: address.area,
                    landmark: address.landmark || "",
                    pincode: address.pincode,
                    isDefault: address.isDefault,
                  });
                }}
              >
                Edit
              </button>
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={async () => setAddresses(await addressService.setDefaultAddress(address._id))}
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                onClick={async () => setAddresses(await addressService.deleteAddress(address._id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit address" : "Add address"}</h3>
        <div className="field">
          <label htmlFor="label">Label</label>
          <select id="label" value={form.label} onChange={(e) => update("label", e.target.value)}>
            <option value="HOME">HOME</option>
            <option value="WORK">WORK</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        {[
          ["fullName", "Full name"],
          ["mobile", "Mobile"],
          ["flatHouse", "Flat / House"],
          ["buildingSociety", "Building / Society"],
          ["area", "Area"],
          ["landmark", "Landmark"],
          ["pincode", "Pincode"],
        ].map(([id, label]) => (
          <div className="field" key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              value={form[id]}
              onChange={(e) =>
                update(
                  id,
                  id === "mobile"
                    ? digitsOnly(e.target.value, 10)
                    : id === "pincode"
                      ? digitsOnly(e.target.value, 6)
                      : e.target.value
                )
              }
              required={id !== "landmark"}
            />
          </div>
        ))}
        <label className="confirm-check">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => update("isDefault", e.target.checked)}
          />
          <span>Set as default</span>
        </label>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : editingId ? "Update address" : "Add address"}
        </Button>
      </form>
    </section>
  );
}
