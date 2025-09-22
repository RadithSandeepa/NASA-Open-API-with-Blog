export const sendToken = (user, statusCode, message, res) => {
  const token = user.getJWTToken();
  
  // Secure cookie options following security best practices
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents XSS attacks by making cookie inaccessible to JavaScript
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection
    path: '/', // Cookie available for entire domain
  };

  // Additional security: Only include sameSite=none if secure=true (required for cross-site)
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none'; // Required for cross-origin requests in production
  } else {
    options.secure = false; // Allow HTTP in development
    options.sameSite = 'lax'; // Provides CSRF protection while allowing normal navigation
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
