import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className="acc">
      {items.map((item) => {
        const open = openId === item.id;
        const panelId = `acc-${item.id}`;
        return (
          <div key={item.id} className={`acc__item ${open ? "is-open" : ""}`}>
            <h3>
              <button
                type="button"
                id={`${panelId}-btn`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span>{item.question}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </button>
            </h3>
            <div className="acc__panel" id={panelId} role="region" aria-labelledby={`${panelId}-btn`}>
              <div className="acc__panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
