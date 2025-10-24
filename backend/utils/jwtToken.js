export const sendToken = (user, statusCode, message, res) => {
  const token = user.getJWTToken();
  
  // Secure cookie options following security best practices
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection
    path: '/', 
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none'; 
  } else {
    options.secure = false; 
    options.sameSite = 'lax'; 
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
