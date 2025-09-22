import express from "express";
import {
  blogPost,
  deleteBlog,
  getAllBlogs,
  getMyBlogs,
  getSingleBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { validateFileUpload } from "../middlewares/fileValidation.js";

const router = express.Router();

// Apply file validation middleware to routes that handle file uploads
router.post("/post", isAuthenticated, isAuthorized("Author"), validateFileUpload, blogPost);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Author"),
  deleteBlog
);
router.get("/all", getAllBlogs);
router.get("/singleblog/:id", isAuthenticated, getSingleBlog);
router.get("/myblogs", isAuthenticated, isAuthorized("Author"), getMyBlogs);
router.put("/update/:id", isAuthenticated, isAuthorized("Author"), validateFileUpload, updateBlog);

export default router;
