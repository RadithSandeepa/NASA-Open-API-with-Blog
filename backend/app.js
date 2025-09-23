import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import authRouter from "./routes/authRouter.js";
import passport from "./middlewares/passportConfig.js";

dotenv.config({ path: "./.env" });

const app = express();

const defaultOrigins = [
  "https://nasa-open-api-with-blog-frontend.vercel.app",
  "http://localhost:5173",
];

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : defaultOrigins;

// Rate limiting for file uploads (more restrictive)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 file upload requests per windowMs
  message: {
    success: false,
    message: "Too many file upload requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});

app.use(generalLimiter);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Configure file upload middleware BEFORE other body parsers
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.platform === 'win32' ? './tmp/' : '/tmp/', // Windows-compatible temp directory
    // File size limits (configurable via environment)
    limits: { 
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // Default: 10MB
      files: parseInt(process.env.MAX_FILES_PER_REQUEST) || 5 // Default: 5 files
    },
    // Additional security options
    abortOnLimit: true, // Abort if limits exceeded
    responseOnLimit: "File upload limit exceeded", // Custom error message
    limitHandler: (req, res, next) => {
      // Custom handler for limit exceeded
      const maxSizeMB = Math.round((parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024);
      const maxFiles = parseInt(process.env.MAX_FILES_PER_REQUEST) || 5;
      res.status(413).json({
        success: false,
        message: `File upload limit exceeded. Maximum file size: ${maxSizeMB}MB, Maximum files: ${maxFiles}`
      });
    },
    // Upload timeout (configurable via environment)
    uploadTimeout: parseInt(process.env.UPLOAD_TIMEOUT) || 60000, // Default: 60 seconds
    parseNested: true, // Parse nested objects in form data
    // Additional protection
    createParentPath: true, // Create parent directories if they don't exist
    preserveExtension: true, // Preserve file extensions for temp files
    safeFileNames: true, // Use safe file names
    // Security features
    debug: process.env.NODE_ENV === 'development'
  })
);

// Configure other body parsers AFTER file upload middleware
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payload size

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", uploadLimiter, blogRouter); // Apply stricter rate limiting to blog routes

dbConnection();

app.use(errorMiddleware);

export default app;

