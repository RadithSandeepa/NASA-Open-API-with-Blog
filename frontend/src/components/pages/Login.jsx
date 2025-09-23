import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, OAUTH_PROVIDERS } from "../../utils/constants";
import "../../styles/auth-page.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { mode, isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);
      setUser(data.user);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      setRole("");
      navigateTo("/home");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to login. Please try again.";
      toast.error(message);
    }
  };

  const handleOAuthLogin = (providerKey) => {
    const provider = OAUTH_PROVIDERS[providerKey];
    if (!provider) {
      toast.error("Unsupported provider.");
      return;
    }
    window.location.href = `${API_BASE_URL}/api/v1/auth/${providerKey}`;
  };

  if (isAuthenticated) {
    return <Navigate to={"/home"} />;
  }

  return (
    <article className={`auth-page ${mode === "dark" ? "auth-page--dark" : "auth-page--light"}`}>
      <section className="login-card">
        <div className="login-card__form">
          <header className="login-card__header">
            <h1>Welcome back</h1>
            <p>Sign in to keep tracking NASA discoveries, curated blogs, and asteroid watchlists.</p>
          </header>

          <form onSubmit={handleLogin} className="login-card__fields">
            <label htmlFor="login-email" className="login-card__field">
              <span>Email</span>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label htmlFor="login-password" className="login-card__field">
              <span>Password</span>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <div className="login-card__actions">
              <button className="login-card__submit" type="submit">
                Log in
              </button>
              <p>
                Don't have an account? <Link to={"/register"}>Register now</Link>
              </p>
            </div>
          </form>

          <div className="login-card__divider">
            <span />
            <p>Or continue with</p>
            <span />
          </div>

          <div className="oauth-btn-group">
            <button
              type="button"
              className="oauth-btn google"
              onClick={() => handleOAuthLogin("google")}
            >
              <span className="oauth-btn__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false" role="presentation">
                  <path d="M21.35 11.1H12v2.8h5.3c-.23 1.48-1.63 4.34-5.3 4.34a5.64 5.64 0 0 1 0-11.28 5.13 5.13 0 0 1 3.63 1.42l2.48-2.38A8.71 8.71 0 0 0 12 4a8.49 8.49 0 1 0 8.27 10.53 8.28 8.28 0 0 0 .93-3.42 7.41 7.41 0 0 0-.85-0.01Z" />
                </svg>
              </span>
              Continue with Google
            </button>
            <button
              type="button"
              className="oauth-btn github"
              onClick={() => handleOAuthLogin("github")}
            >
              <span className="oauth-btn__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false" role="presentation">
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48s0-.87 0-1.71c-2.78.6-3.37-1.34-3.37-1.34a2.66 2.66 0 0 0-1.11-1.47c-.91-.62.07-.61.07-.61a2.1 2.1 0 0 1 1.54 1 2.13 2.13 0 0 0 2.92.83 2.16 2.16 0 0 1 .63-1.34c-2.22-.25-4.55-1.11-4.55-4.93a3.86 3.86 0 0 1 1-2.68 3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1a9.6 9.6 0 0 1 5 0c1.91-1.31 2.75-1 2.75-1a3.6 3.6 0 0 1 .1 2.64 3.86 3.86 0 0 1 1 2.68c0 3.83-2.34 4.68-4.57 4.92a2.4 2.4 0 0 1 .69 1.85c0 1.34 0 2.42 0 2.75s.18.59.69.48A10 10 0 0 0 12 2Z" />
                </svg>
              </span>
              Continue with GitHub
            </button>
          </div>
        </div>

        <aside className="login-card__aside">
          <h2>Orbit Navigator</h2>
          <p>Plug into mission control with a personalized space dashboard.</p>
          <ul>
            <li>Track near-Earth objects with live updates.</li>
            <li>Save curated NASA imagery to your collections.</li>
            <li>Follow community blog highlights from fellow explorers.</li>
          </ul>
        </aside>
      </section>
    </article>
  );
};

export default Login;
