const buildCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  const days = Number(process.env.COOKIE_EXPIRE || 3);
  return {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  };
};

export const attachTokenCookie = (user, res) => {
  const token = user.getJWTToken();
  const options = buildCookieOptions();
  res.cookie("token", token, options);
  return token;
};

export const sendToken = (user, statusCode, message, res) => {
  const token = attachTokenCookie(user, res);
  res.status(statusCode).json({
    success: true,
    user,
    message,
    token,
  });
};
