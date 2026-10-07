import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../context/AuthContext";
import { digitsOnly } from "../utils/validators";
import Button from "../components/Button";

export default function RegisterPage() {
  usePageMeta({ title: pageTitle("Create Account"), description: "Create your Biryani By Brothers account." });
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/account";
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(redirect, { replace: true });
  }, [isAuthenticated, navigate, redirect]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        mobile: form.mobile,
        email: form.email || undefined,
        password: form.password,
      });
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="wrap auth-wrap">
        <p className="kicker">Join the handi</p>
        <h1>Create Account</h1>
        <p className="auth-lead">You’ll need an account only when you’re ready to checkout.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="field__error" role="alert">
              {error}
            </p>
          )}
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              value={form.mobile}
              onChange={(e) => update("mobile", digitsOnly(e.target.value, 10))}
              inputMode="numeric"
              autoComplete="tel"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>Login</Link>
        </p>
      </div>
    </div>
  );
}
