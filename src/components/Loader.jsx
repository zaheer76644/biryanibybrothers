export default function Loader({ label = "Loading" }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__ring" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
