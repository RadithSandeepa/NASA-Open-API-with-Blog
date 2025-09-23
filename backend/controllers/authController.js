import { attachTokenCookie } from "../utils/jwtToken.js";

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

export const oauthSuccess = (provider) => (req, res) => {
  if (!req.user) {
    const failureUrl = new URL("/login", getClientUrl());
    failureUrl.searchParams.set("error", provider);
    return res.redirect(failureUrl.toString());
  }

  attachTokenCookie(req.user, res);

  const redirectUrl = new URL("/auth/callback", getClientUrl());
  redirectUrl.searchParams.set("status", "success");
  redirectUrl.searchParams.set("provider", provider);

  return res.redirect(redirectUrl.toString());
};
