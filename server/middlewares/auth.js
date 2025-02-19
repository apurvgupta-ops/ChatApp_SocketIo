import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/features.js";
import { User } from "../models/user.js";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SCREAT);
  req.user = decodedData._id;

  next();
};


const socketAuthenticator = async (err, socket, next) => {

  try {
    if (err) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }
    const authToken = socket.request.cookies.token;
    if (!authToken) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(authToken, process.env.JWT_SCREAT);
    socket.user = await User.findById(decodedData._id)
    return next();

  } catch (error) {
    console.error(error)
    return next(new ErrorHandler("Please login to access this route", 401));
  }
}
export { isAuthenticated, socketAuthenticator };
