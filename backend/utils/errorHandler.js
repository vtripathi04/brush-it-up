export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
