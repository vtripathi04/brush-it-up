export const successResponse = (res, message, data = {}, status = 200) => {
    return res.status(status).json({
      status: 'success',
      message,
      data,
    });
};

export const errorResponse = (res, message, status = 500, error = null) => {
    return res.status(status).json({
        status: 'error',
        message,
        error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
};
