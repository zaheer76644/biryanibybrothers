import { X } from "lucide-react";
import { useEffect } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

export default function Modal({ open, title, onClose, children }) {
  const ref = useFocusTrap(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay is-open modal-overlay" onClick={onClose}>
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-btn icon-btn--dark" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
