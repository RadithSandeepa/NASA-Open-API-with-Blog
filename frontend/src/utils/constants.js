export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://nasa-open-api-with-blog.vercel.app";

export const FRONTEND_BASE_URL =
  import.meta.env.VITE_CLIENT_URL || window.location.origin;

export const OAUTH_PROVIDERS = {
  google: {
    label: "Google",
  },
  github: {
    label: "GitHub",
  },
};
