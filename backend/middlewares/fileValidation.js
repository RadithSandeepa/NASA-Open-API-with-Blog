import ErrorHandler from "./error.js";

// File validation middleware for enhanced security
export const validateFileUpload = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/webp"
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;

  // Check number of files
  const fileCount = Object.keys(req.files).length;
  if (fileCount > maxFiles) {
    return next(new ErrorHandler(`Too many files. Maximum ${maxFiles} files allowed.`, 400));
  }

  // Validate each file
  for (const [fieldName, file] of Object.entries(req.files)) {
    const fileArray = Array.isArray(file) ? file : [file];
    
    for (const singleFile of fileArray) {
      // Check file size
      if (singleFile.size > maxFileSize) {
        return next(new ErrorHandler(`File ${singleFile.name} is too large. Maximum size: 10MB`, 400));
      }

      // Check MIME type
      if (!allowedMimeTypes.includes(singleFile.mimetype)) {
        return next(new ErrorHandler(`Invalid file type for ${singleFile.name}. Only JPEG, JPG, PNG, and WEBP are allowed.`, 400));
      }

      // Check file extension (additional security)
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const fileExtension = singleFile.name.toLowerCase().substring(singleFile.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        return next(new ErrorHandler(`Invalid file extension for ${singleFile.name}. Only .jpg, .jpeg, .png, and .webp are allowed.`, 400));
      }

      // Validate filename (prevent path traversal)
      if (singleFile.name.includes('..') || singleFile.name.includes('/') || singleFile.name.includes('\\')) {
        return next(new ErrorHandler(`Invalid filename: ${singleFile.name}`, 400));
      }

      // Check for potentially dangerous content in filename
      const dangerousPatterns = [
        /\.(php|asp|aspx|jsp|js|html|htm|xml)$/i,
        /\.(exe|bat|cmd|com|scr|vbs)$/i,
        /\.(sh|bash|zsh|fish)$/i
      ];

      if (dangerousPatterns.some(pattern => pattern.test(singleFile.name))) {
        return next(new ErrorHandler(`Potentially dangerous file type detected: ${singleFile.name}`, 400));
      }
    }
  }

  next();
};

// Additional helper for file size checking
export const checkFileSizeMiddleware = (maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    if (req.files) {
      for (const [fieldName, file] of Object.entries(req.files)) {
        const fileArray = Array.isArray(file) ? file : [file];
        
        for (const singleFile of fileArray) {
          if (singleFile.size > maxSize) {
            return next(new ErrorHandler(`File ${singleFile.name} exceeds maximum size limit`, 413));
          }
        }
      }
    }
    next();
  };
};