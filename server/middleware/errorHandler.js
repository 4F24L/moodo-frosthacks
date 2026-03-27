const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default to 500 if no status code
  const statusCode = err.statusCode || err.status || 500;

  // Handle specific error types
  let message = err.message || "Internal Server Error";
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Generic error response
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected error occurred. Please try again.' : message,
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack,
      details: err.details || undefined,
    }),
  });
};

export default errorHandler;
