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
import { NEW_REQUEST, REFETCH_CHAT } from "../constants/event.js";
import { uploadFilesToCloudinary } from "../utils/cloudinary.js";

const signupController = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;
  const file = req.file;

  if (!name || !username || !password) {
    return next(new ErrorHandler("Please provide all the details", 404));
  }
  console.count("calling");
  let result;
  let avatar;

  if (file) {
    result = await uploadFilesToCloudinary([file]);
    console.log({ result });
    console.count("calling");
  }

  if (result) {
    console.count("calling");

    avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };
  }
  console.count("calling");

  const user = await User.create({ name, username, password, avatar, bio });
  console.count("calling");

  sendToken(res, user, 201, "User Created Successfully");
  console.count("calling");
});

const loginController = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const userExist = await User.findOne({ username }).select("+password");

  if (!username || !password) {
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
  const myChats = await Chat.find({ groupChat: false, members: req.user });

  // All the users from my chats means friends or peoples i have chatted with,
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});

const sendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });
  if (request) return next(new ErrorHandler("Request already send", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvents(req, NEW_REQUEST, [userId], "request");

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request Not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not allowed to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name} and ${request.receiver.name}`,
    }),

    request.deleteOne(),
  ]);

  emitEvents(req, REFETCH_CHAT, members);
  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

const getMyAllFriendRequestNotifications = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequest = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequest,
  });
});

const getMyAllFriends = TryCatch(async (req, res, next) => {
  const { chatId } = req.query;

  const chats = await Chat.find({
    members: req.users,
    groupChat: false,
  }).populate("members", "name avatar");

  const otherMember = members.find(
    (member) => member._id.toString() !== req.user.toString()
  );
  const friends = chats.map(({ members }) => {
    const otherMembers = otherMember(members, req.user);

    return {
      _id: otherMember._id,
      name: otherMember.name,
      avatar: otherMember.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  loginController,
  signupController,
  getProfile,
  logout,
  search,
  sendRequest,
  acceptRequest,
  getMyAllFriendRequestNotifications,
  getMyAllFriends,
};
