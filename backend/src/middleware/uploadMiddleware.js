const path = require('path');
const fs = require('fs');

/**
 * Upload Middleware
 * Supports file uploads to organized directories (dpr, invoices, documents, receipts).
 */
const uploadMiddleware = (subfolder = 'documents') => {
  return (req, res, next) => {
    // If multer is present in environment, it handles multipart/form-data.
    // Fallback safe handler for non-multipart or standard file payloads:
    const targetDir = path.join(__dirname, '../../uploads', subfolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    req.uploadDir = targetDir;
    next();
  };
};

module.exports = uploadMiddleware;

