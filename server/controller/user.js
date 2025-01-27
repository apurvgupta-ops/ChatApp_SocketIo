import { compare } from "bcrypt";
import { User } from "../models/user.js";
import {
  cookieOptions,
  ErrorHandler,
  sendToken,
  TryCatch,
} from "../utils/features.js";

const signupController = async (req, res) => {
  try {
    const { name, userName, password, avatar } = req.body;

    const user = await User.create({ name, userName, password, avatar });

    sendToken(res, user, 201, "User Created Successfully");
  } catch (error) {
    console.error(error);
  }
};

const loginController = TryCatch(async (req, res, next) => {
  const { userName, password } = req.body;
  const userExist = await User.findOne({ userName }).select("+password");

  if (!userName || !password) {
    return next(new ErrorHandler("Please enter all the credentials", 404));
  }

  if (!userExist) return next(new ErrorHandler("User not exist", 404));

  const isPasswordMatch = compare(password, userExist.password);

  if (!isPasswordMatch)
    return next(new ErrorHandler("Password not Matched", 404));

  sendToken(res, userExist, 200, "Login successfully");
});

const getProfile = TryCatch(async (req, res, next) => {
  const userId = req.user;
  const user = await User.findById(userId);
  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logout Successsfully",
    });
});

const search = TryCatch(async (req, res, next) => {
  const { name } = req.query;
});

export { loginController, signupController, getProfile, logout };
