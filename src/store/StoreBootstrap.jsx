import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { bootstrapAuth } from "./slices/authSlice";
import { bootstrapAdmin } from "./slices/adminAuthSlice";
import { loadCatalog } from "./slices/catalogSlice";
import { dismissToast } from "./slices/cartSlice";
import { useAppSelector } from "./hooks";

export default function StoreBootstrap({ children }) {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((s) => s.cart.toast);

  useEffect(() => {
    dispatch(bootstrapAuth());
    dispatch(bootstrapAdmin());
    dispatch(loadCatalog());
  }, [dispatch]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => dispatch(dismissToast()), 2800);
    return () => window.clearTimeout(id);
  }, [toast, dispatch]);

  return children;
}
