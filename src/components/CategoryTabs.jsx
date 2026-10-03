export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="tabs-wrap">
      <div className="wrap">
        <div className="tabs" role="tablist" aria-label="Menu categories">
          {categories.map((category) => {
            const selected = active === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={selected ? "is-active" : ""}
                onClick={() => onChange(category.id)}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
