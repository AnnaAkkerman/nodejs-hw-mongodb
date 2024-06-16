import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: {
        message: err.message,
      },
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: {
      message: err.message,
    },
  });
};
