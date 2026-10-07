import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadCatalog, selectAddOnsFor, selectProductById } from "../store/slices/catalogSlice";

export function CatalogProvider({ children }) {
  return children;
}

export function useCatalog() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.catalog.products);
  const categories = useAppSelector((s) => s.catalog.categories);
  const settings = useAppSelector((s) => s.catalog.settings);
  const isLoading = useAppSelector((s) => s.catalog.isLoading);
  const error = useAppSelector((s) => s.catalog.error);
  const fromApi = useAppSelector((s) => s.catalog.fromApi);

  const reload = useCallback(() => dispatch(loadCatalog()), [dispatch]);

  const getProduct = useCallback(
    (idOrSlug) => selectProductById({ catalog: { products } }, idOrSlug),
    [products]
  );

  const getAddOnsFor = useCallback(
    (forDiet) => selectAddOnsFor({ catalog: { products } }, forDiet),
    [products]
  );

  return {
    products,
    categories,
    settings,
    isLoading,
    error,
    fromApi,
    reload,
    getProduct,
    getAddOnsFor,
  };
}
