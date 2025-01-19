const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  return res.status(err.statusCode).json({
    status: false,
    message: err.message,
  });
};

export { errorMiddleware };
