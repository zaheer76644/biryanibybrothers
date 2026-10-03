export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
  allowRemove = false,
  className = "",
}) {
  const canDecrease = allowRemove ? value >= 1 : value > min;

  return (
    <div className={`qty ${className}`.trim()} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={allowRemove && value <= 1 ? "Remove from cart" : "Decrease quantity"}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
