import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return next(new ErrorHandler("Please fill full details!", 400));
  }

  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const role = "Reader";
  user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    phone: String(phone),
  });
  sendToken(user, 200, "User registered successfully", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password providers"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  if (!user.password) {
    return next(
      new ErrorHandler(
        "This account uses social login. Please continue with Google or GitHub.",
        400
      )
    );
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(user, 200, "User logged in successfully", res);
});

export const logout = catchAsyncErrors((req, res, next) => {
  // Use the same security settings when clearing the cookie
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  res
    .status(200)
    .cookie("token", "", cookieOptions)
    .json({
      success: true,
      message: "User logged out!",
    });
});

export const getMyProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllAuthors = catchAsyncErrors(async (req, res, next) => {
  const authors = await User.find({ role: "Author" });
  res.status(200).json({
    success: true,
    authors,
  });
});
