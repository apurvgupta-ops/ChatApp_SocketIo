import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getMyChats,
  getMyGroups,
  newGroup,
  addNewMember,
  removeMember,
  leaveGroup,
} from "../controller/chat.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/new-group", newGroup);
router.get("/my-chats", getMyChats);
router.get("/my-group", getMyGroups);
router.put("/add-members", addNewMember);
router.put("/remove-member", removeMember);
router.delete("/leave-group", leaveGroup);

export default router;
