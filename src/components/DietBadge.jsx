const labels = {
  veg: "Veg",
  "non-veg": "Non-Veg",
  egg: "Egg",
};

export default function DietBadge({ diet, className = "" }) {
  if (!diet || !labels[diet]) return null;

  return (
    <span className={`diet diet--${diet} ${className}`.trim()} title={labels[diet]}>
      <i aria-hidden="true" />
      <span>{labels[diet]}</span>
    </span>
  );
}
