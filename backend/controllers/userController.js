import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// export const register = catchAsyncErrors(async (req, res, next) => {
//   const { name, email, password, phone } = req.body;
//   if (
//     !name ||
//     !email ||
//     !password ||
//     !phone
//   ) {
//     return next(new ErrorHandler("Please fill full details!", 400));
//   }
//   let user = await User.findOne({ email });
//   if (user) {
//     return next(new ErrorHandler("User already existes", 400));
//   }

//   const role = "Author";

//   user = await User.create({
//     name,
//     email,
//     password,
//     phone,
//     role,
//   });
//   sendToken(user, 200, "User registered successfully", res);
// });

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phone} = req.body;
  if (!name || !email || !password || !phone) {
    return next(new ErrorHandler("Please fill full details!", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const role = "Author";
  user = await User.create({
    name,
    email,
    password,
    role,
    phone
  });
  sendToken(user, 200, "User registered successfully", res);
});



export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  sendToken(user, 200, "User logged in successfully", res);
});

export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
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
