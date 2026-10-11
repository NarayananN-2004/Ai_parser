import multer from 'multer';

// Configure multer memory storage (no disk clutter)
const storage = multer.memoryStorage();

export const uploadSingleResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase();
    if (ext.endsWith('.pdf') || ext.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and TXT resumes are allowed.'));
    }
  },
}).single('resume');

/**
 * Global error handling middleware for express
 */
export function errorHandler(err, req, res, next) {
  console.error('API Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}
