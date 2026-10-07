import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const tabs = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/orders", label: "My Orders" },
  { to: "/account/addresses", label: "Saved Addresses" },
];

export default function AccountPage() {
  usePageMeta({ title: pageTitle("My Account"), description: "Manage your Biryani By Brothers account." });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="page account-page">
      <div className="wrap">
        <p className="kicker">My Account</p>
        <h1>Hello, {user?.name?.split(" ")[0] || "friend"}</h1>
        <nav className="account-tabs" aria-label="Account">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {tab.label}
            </NavLink>
          ))}
          <button type="button" className="account-tabs__logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export function AccountProfile() {
  const { user } = useAuth();
  return (
    <section className="account-panel">
      <h2>Profile</h2>
      <dl className="account-dl">
        <div>
          <dt>Name</dt>
          <dd>{user?.name}</dd>
        </div>
        <div>
          <dt>Mobile</dt>
          <dd>{user?.mobile}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user?.email || "—"}</dd>
        </div>
      </dl>
      <Button to="/account/orders" variant="outline">
        View orders
      </Button>
    </section>
  );
}
