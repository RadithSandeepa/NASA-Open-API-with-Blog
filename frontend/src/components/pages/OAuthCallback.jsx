import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { API_BASE_URL, OAUTH_PROVIDERS } from "../../utils/constants";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setIsAuthenticated } = useContext(Context);
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }
    hasHandledCallback.current = true;

    const completeLogin = async () => {
      const status = searchParams.get("status");
      const providerKey = searchParams.get("provider") || "oauth";
      const provider = OAUTH_PROVIDERS[providerKey]?.label || providerKey;
      const error = searchParams.get("error");

      if (status !== "success") {
        toast.error(
          error ? `Unable to authenticate with ${error}.` : "Authentication cancelled."
        );
        navigate("/login", { replace: true });
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/user/myprofile`, {
          withCredentials: true,
        });
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success(`Logged in with ${provider}.`);
        navigate("/home", { replace: true });
      } catch (profileError) {
        toast.error("Login succeeded, but we couldn't load your profile. Please try again.");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };

    completeLogin();
  }, [navigate, searchParams, setIsAuthenticated, setUser]);

  return (
    <section className="auth-form">
      <div className="oauth-loading">
        <h2>Connecting to your account...</h2>
        <p>You will be redirected in a moment.</p>
      </div>
    </section>
  );
};

export default OAuthCallback;
