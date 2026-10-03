import { useMemo, useState } from "react";
import { menuCategories, getByCategory } from "../data/menu";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import PageHero from "../components/PageHero";
import CategoryTabs from "../components/CategoryTabs";
import MenuCard from "../components/MenuCard";

export default function MenuPage() {
  usePageMeta({
    title: pageTitle("Menu"),
    description:
      "Veg and non-veg dum biryani from Biryani By Brothers in Mira Road. Order chicken, veg, egg biryani, combos and more.",
  });
  const [active, setActive] = useState("all");
  const items = useMemo(() => getByCategory(active), [active]);

  return (
    <div className="page">
      <PageHero
        eyebrow="The menu"
        title="Cooked in small batches."
        text="Veg and non-veg biryani, combos and sides. Prices are for one portion."
      />
      <CategoryTabs categories={menuCategories} active={active} onChange={setActive} />
      <section className="section section--cream menu-section">
        <div className="wrap">
          {items.length === 0 ? (
            <p className="empty-note">Nothing in this part of the menu yet.</p>
          ) : (
            <div className="menu-grid">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
