export default function Ornament({ align = "center", light = false }) {
  return (
    <div className={`ornament ${align === "left" ? "is-left" : ""} ${light ? "is-light" : ""}`} aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}
