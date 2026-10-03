import { formatINR } from "../utils/currency";

export default function AddOnSelector({ addOns, selected, onToggle }) {
  if (!addOns.length) return null;

  return (
    <fieldset className="addons">
      <legend>Add-ons</legend>
      <p className="addons__note">Charged once for each box.</p>
      <div className="addons__list">
        {addOns.map((addon) => {
          const checked = selected.includes(addon.id);
          return (
            <label key={addon.id} className={`addon ${checked ? "is-on" : ""}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(addon.id)}
              />
              <span className="addon__name">{addon.name}</span>
              <span className="addon__price">+ {formatINR(addon.price)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
