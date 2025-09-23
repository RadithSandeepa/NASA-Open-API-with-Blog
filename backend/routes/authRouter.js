import express from "express";
import dotenv from "dotenv";
import passport from "../middlewares/passportConfig.js";
import { oauthSuccess } from "../controllers/authController.js";

dotenv.config({ path: "./.env" });

const router = express.Router();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${clientUrl}/login?error=google`,
  }),
  oauthSuccess("google")
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${clientUrl}/login?error=github`,
  }),
  oauthSuccess("github")
);


export default router;
