import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { pageTitle } from "../config/brand";
import { usePageMeta } from "../hooks/usePageMeta";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function LoginPage() {
  usePageMeta({ title: pageTitle("Login"), description: "Login to Biryani By Brothers." });
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/account";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(redirect, { replace: true });
  }, [isAuthenticated, navigate, redirect]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ identifier, password });
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="wrap auth-wrap">
        <p className="kicker">Welcome back</p>
        <h1>Login</h1>
        <p className="auth-lead">Sign in to checkout, track orders, and manage addresses.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="field__error" role="alert">
              {error}
            </p>
          )}
          <div className="field">
            <label htmlFor="identifier">Mobile Number / Email</label>
            <input
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </Button>
        </form>
        <p className="auth-switch">
          <span>Forgot password? Contact the kitchen.</span>
          <br />
          New here?{" "}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
