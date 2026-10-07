import { useMemo, useState } from "react";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useCatalog } from "../context/CatalogContext";
import PageHero from "../components/PageHero";
import CategoryTabs from "../components/CategoryTabs";
import MenuCard from "../components/MenuCard";
import Loader from "../components/Loader";

function filterProducts(products, active) {
  if (!active || active === "all") return products;
  if (active === "veg") return products.filter((item) => item.diet === "veg");
  if (active === "non-veg") {
    return products.filter((item) => item.diet === "non-veg" || item.diet === "egg");
  }
  return products.filter((item) => item.category === active);
}

export default function MenuPage() {
  usePageMeta({
    title: pageTitle("Menu"),
    description:
      "Veg and non-veg dum biryani from Biryani By Brothers in Mira Road. Order chicken, veg, egg biryani, combos and more.",
  });
  const { products, categories, isLoading, error, settings } = useCatalog();
  const [active, setActive] = useState("all");
  const items = useMemo(() => filterProducts(products, active), [products, active]);

  return (
    <div className="page">
      <PageHero
        eyebrow="The menu"
        title="Cooked in small batches."
        text="Veg and non-veg biryani, combos and sides. Prices are for one portion."
      />
      {settings?.announcement && (
        <div className="wrap">
          <p className="menu-announcement" role="status">
            {settings.announcement}
          </p>
        </div>
      )}
      {settings?.orderingStatus && settings.orderingStatus !== "OPEN" && (
        <div className="wrap">
          <p className="menu-status" role="status">
            {settings.orderingStatus === "ORDERS_PAUSED" ? "Orders paused" : "Currently closed"}
            {settings.orderingMessage ? ` — ${settings.orderingMessage}` : ""}
          </p>
        </div>
      )}
      <CategoryTabs categories={categories} active={active} onChange={setActive} />
      <section className="section section--cream menu-section">
        <div className="wrap">
          {isLoading && <Loader label="Loading menu…" />}
          {!isLoading && error && (
            <p className="empty-note">Couldn’t refresh the kitchen menu. Showing what’s available.</p>
          )}
          {!isLoading && items.length === 0 ? (
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
