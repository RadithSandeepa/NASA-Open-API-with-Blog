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

const sanitizeUser = (user) => {
  if (!user) return user;
  const rawUser =
    typeof user.toObject === 'function' ? user.toObject() : { ...user };
  const sanitizedUser = { ...rawUser };
  delete sanitizedUser.password;
  delete sanitizedUser.phone;
  return sanitizedUser;
};

export const attachTokenCookie = (user, res) => {
  const token = user.getJWTToken();
  const options = getCookieOptions();

  res.cookie("token", token, options);

  return token;
};

export const sendToken = (user, statusCode, message, res) => {
  attachTokenCookie(user, res);

  const sanitizedUser = sanitizeUser(user);

  res.status(statusCode).json({
    success: true,
    user: sanitizedUser,
    message,
  });
};
