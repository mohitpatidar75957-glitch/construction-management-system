/**
 * Unified Response Handler Utility
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, message = 'Error', statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    errors,
    timestamp: new Date().toISOString()
  });
};

const paginatedResponse = (res, items, page = 1, limit = 10, total = 0, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages: Math.ceil(total / limit)
    },
    data: items,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};

