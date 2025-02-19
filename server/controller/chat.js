import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHAT,
} from "../constants/event.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { emitEvents } from "../utils/event.js";
import {
  ErrorHandler,
  TryCatch,
} from "../utils/features.js";
import { deleteFilesFromCloudinary } from "../utils/cloudinary.js";

const newGroup = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length <= 2) {
    return next(
      new ErrorHandler("Please add atleast 3 members in the group", 400)
    );
  }

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvents(req, ALERT, allMembers, `Welcome to the ${name} group`);
  emitEvents(req, REFETCH_CHAT, members);

  res.status(201).json({
    success: true,
    message: "New Group Created",
  });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const userId = req.user;

  const myChats = await Chat.find({ members: userId }).populate(
    "members",
    "name avatar"
  );

  // console.log({ myChats });

  const transformedChats = myChats.map(({ _id, name, members, groupChat }) => {
    const otherMember = members.find(
      (member) => member._id.toString() !== userId.toString()
    );
    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : otherMember.avatar.url,
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const myGroups = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const transformedGroups = myGroups.map(
    ({ _id, groupChat, members, name }) => {
      return {
        _id,
        name,
        groupChat,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
      };
    }
  );
  res.status(200).json({
    success: true,
    groups: transformedGroups,
  });
});

const addNewMember = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  const userId = req.user;

  if (!members || !members.length > 1) {
    return next(new ErrorHandler("Please Provide members"), 400);
  }

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("No chat found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("this is not a groupChat", 400));

  if (userId.toString() !== chat.creator._id.toString()) {
    return next(new ErrorHandler("you are not admin"));
  }

  const allNewMembersPromise = members.map((id) => User.findById(id));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.include(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler("Limit reached", 400));
  }

  await chat.save();

  const allUserNames = allNewMembers.map(({ name }) => name).join(",");

  emitEvents(req, ALERT, chat.members, `${allUserNames} added in the group`);
  emitEvents(req, REFETCH_CHAT, chat.members);

  res.status(200).json({
    success: true,
    chat,
  });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId),
  ]);

  if (!chat) return next(new ErrorHandler("No chat found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("this is not a groupChat", 400));

  if (userId.toString() !== chat.creator._id.toString()) {
    return next(new ErrorHandler("you are not admin"));
  }

  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group Contain atleast 3 members", 400));
  }

  chat.members = chat.members.filter(
    (id) => id.toString() !== userId.toString()
  );

  await chat.save();

  emitEvents(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved} remove from the group`
  );
  emitEvents(req, REFETCH_CHAT, chat.members);

  res.status(200).json({
    success: true,
    chat,
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("No chat found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("this is not a groupChat", 400));

  const remainingMembers = chat.members.filter(
    (i) => i.toString() !== req.user.toString()
  );

  if (req.user.toString() === chat.creator.toString()) {
    const assignNewCreator = Math.floor(
      Math.random() * remainingMembers.length
    );
    const newCreator = remainingMembers[assignNewCreator];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([User.findById(req.user), chat.save()]);

  emitEvents(req, ALERT, chat.members, `${user.name} has left the group`);

  res.status(200).json({
    success: true,
    chat,
  });
});

const sendAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const userId = req.user;

  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 400));
  }

  //Upload attachment Here;
  const files = req.files || [];

  if (!files.length < 1)
    return next(new ErrorHandler("Please provide files", 400));

  const attachments = [];

  const messageForDb = {
    content: "",
    attachments,
    sender: user._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDb,
    sender: {
      _id: user._id,
      name: user.name,
    },
  };

  const message = await Message.create(messageForDb);

  emitEvents(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
  });
  emitEvents(req, NEW_MESSAGE_ALERT, chat.members, {
    chatId,
  });

  res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.chatId)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new ErrorHandler("Chat Not found", 404));

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return next(new ErrorHandler("Chat Not found", 404));
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to change name of the group")
    );
  }
  chat.name = name;
  await chat.save();

  emitEvents(req, REFETCH_CHAT, chat.members, {
    message: `Group name Updated ${name}`,
  });

  res.status(201).json({
    success: true,
    message: "Name updated successfully",
  });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to delete Chat"));

  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messageWithAttachments.forEach(({ attachment }) =>
    attachment.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvents(req, REFETCH_CHAT, members);

  return res.status(200).json({
    success: true,
    message: "Chat Deleted Successfully",
  });
});

const getMessages = TryCatch(async (req, res, next) => {

  const { chatId } = req.params
  const { page = 1 } = req.query

  const limit = 20;
  const skip = (page - 1) * limit

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId })
  ])

  const totalPages = Math.ceil(totalMessagesCount / limit)

  res.status(200).json({
    success: true,
    messages,
    totalPages
  })


});

export {
  newGroup,
  getMyChats,
  getMyGroups,
  addNewMember,
  removeMember,
  leaveGroup,
  sendAttachment,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages
};
