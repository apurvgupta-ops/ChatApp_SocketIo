import jwt from "jsonwebtoken";
import { userSocketIds } from "../index.js";



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



const getSockets = (users = []) => {
  console.log({ users })
  const sockets = users.map((user) => userSocketIds.get(user._id.toString()))
  return sockets
}


const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`



export {
  sendToken,
  TryCatch,
  ErrorHandler,
  cookieOptions,
  getSockets, getBase64
};
