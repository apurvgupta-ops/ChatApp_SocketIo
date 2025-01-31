import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { Request } from "../models/request.js";
import { Chat } from "../models/chat.js";
import {
  cookieOptions,
  ErrorHandler,
  sendToken,
  TryCatch,
} from "../utils/features.js";
import { emitEvents } from "../utils/event.js";
import { NEW_REQUEST } from "../constants/event.js";

const signupController = async (req, res) => {
  try {
    const { name, userName, password, avatar } = req.body;

    if (!name || !userName || !password) {
      return next(new ErrorHandler("Please provide all the details", 404));
    }
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

  // All my chats
  const myChats = await Chat.find({ groupChat: false, members: req.user })

  // All the users from my chats means friends or peoples i have chatted with,
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members)

  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" }
  })

  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id, name, avatar: avatar.url
  }))


  return res.status(200).json({
    success: true,
    users
  })
});

const sendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user }
    ]
  })
  if (request) return next(new ErrorHandler("Request already send", 400))

  await Request.create({
    sender: req.user,
    receiver: userId
  })


  emitEvents(req, NEW_REQUEST, [userId], "request")

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent"
  })
});

export { loginController, signupController, getProfile, logout, search, sendRequest };
