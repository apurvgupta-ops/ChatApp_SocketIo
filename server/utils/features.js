import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const sendToken = async (res, user, code, message) => {
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SCREAT);

  return res.status(code).cookie("token", token, cookieOptions).json({
    success: true,
    message,
  });
};

const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { sendToken, TryCatch, ErrorHandler };
