const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

export const attachTokenCookie = (user, res) => {
  const token = user.getJWTToken();
  const options = getCookieOptions();

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