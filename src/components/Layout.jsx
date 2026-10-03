import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import Toast from "./Toast";
import MobileDock from "./MobileDock";
import Loader from "./Loader";
import ErrorBoundary from "./ErrorBoundary";

export default function Layout() {
  const { pathname } = useLocation();
  const { isDrawerOpen, isNavOpen, closeDrawer, closeNav } = useCart();

  useEffect(() => {
    closeDrawer();
    closeNav();
  }, [pathname, closeDrawer, closeNav]);

  useEffect(() => {
    document.body.classList.toggle("scroll-lock", isDrawerOpen || isNavOpen);
    return () => document.body.classList.remove("scroll-lock");
  }, [isDrawerOpen, isNavOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main id="main">
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
      <MobileDock />
    </>
  );
}
