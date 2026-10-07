import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Loader from "../../components/Loader";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Menu" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const { isAuthenticated, isLoading, logout, admin } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="admin-shell">
        <Loader label="Loading admin…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-brand">BBB Admin</p>
        <p className="admin-user">{admin?.name}</p>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
