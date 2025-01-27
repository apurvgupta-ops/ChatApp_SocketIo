import { ALERT, REFETCH_CHAT } from "../constants/event";
import { Chat } from "../models/chat";
import { emitEvents } from "../utils/event";
import { ErrorHandler, TryCatch } from "../utils/features";

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

export { newGroup };
