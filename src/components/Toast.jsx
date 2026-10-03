import { useCart } from "../context/CartContext";

export default function Toast() {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" onClick={dismissToast} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
