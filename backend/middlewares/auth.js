import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import { Blog } from "../models/blogSchema.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

//AUTHENTICATION
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

//AUTHORIZATION
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with this role(${req.user.role}) not allowed to access this resource`
        )
      );
    }
    next();
  };
};

export const isBlogOwner = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  // Allow if user is owner OR admin
  if (blog.createdBy.toString() !== req.user._id.toString() &&  req.user.role !== "Admin") {
    return next(new ErrorHandler("Not authorized to modify this blog", 403));
  }

  req.blog = blog; // attach blog to request so controller can use it
  next();
});
