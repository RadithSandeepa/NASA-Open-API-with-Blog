import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/userSchema.js";

dotenv.config({ path: "./.env" });

const ensureProfileName = (profile) => {
  if (profile.displayName) return profile.displayName;
  const parts = [profile.name?.givenName, profile.name?.familyName].filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (profile.username) return profile.username;
  return "Explorer";
};

const extractPrimaryEmail = (profile) => {
  const emailRecord = profile.emails?.find((email) => email.value);
  return emailRecord?.value?.toLowerCase() ?? null;
};

const upsertOAuthUser = async ({ provider, profile }) => {
  const providerId = profile.id;
  const email = extractPrimaryEmail(profile);
  const name = ensureProfileName(profile);

  const lookupConditions = [
    { providers: { $elemMatch: { provider, providerId } } },
  ];
  if (email) {
    lookupConditions.push({ email });
  }

  let user = await User.findOne({ $or: lookupConditions });

  if (user) {
    const hasProvider = user.providers.some(
      (entry) => entry.provider === provider && entry.providerId === providerId
    );
    if (!hasProvider) {
      user.providers.push({ provider, providerId });
    }

    if (!user.email && email) {
      user.email = email;
    }

    if (!user.name && name) {
      user.name = name;
    }

    await user.save({ validateBeforeSave: false });
    return user;
  }

  const newUserPayload = {
    name,
    role: "Author",
    providers: [{ provider, providerId }],
    phone: null,
  };

  if (email) {
    newUserPayload.email = email;
  }

  user = await User.create(newUserPayload);
  return user;
};

const registerStrategy = ({ name, Strategy, clientID, clientSecret, callbackURL }) => {
  if (!clientID || !clientSecret) {
    console.warn(`[oauth] Skipping ${name} strategy, credentials missing.`);
    return;
  }

  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await upsertOAuthUser({ provider: name, profile });
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

const serverUrl = process.env.SERVER_URL || "http://localhost:4000";

registerStrategy({
  name: "google",
  Strategy: GoogleStrategy,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:
    process.env.GOOGLE_CALLBACK_URL || `${serverUrl}/api/v1/auth/google/callback`,
});

registerStrategy({
  name: "github",
  Strategy: GitHubStrategy,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL:
    process.env.GITHUB_CALLBACK_URL || `${serverUrl}/api/v1/auth/github/callback`,
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
