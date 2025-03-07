import express from "express";
import {
  getProfile,
  loginController,
  logout,
  search,
  signupController,
  sendRequest,
  acceptRequest,
  getMyAllFriendRequestNotifications,
  getMyAllFriends,
} from "../controller/user.js";
import { singleFile } from "../middlewares/uploadFiles.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", singleFile, signupController);
router.post("/login", loginController);

router.use(isAuthenticated); // if dont need to pass everytime in every function

router.get("/me", getProfile);
router.get("/logout", logout);
router.get("/search", search);
router.put("/send-request", sendRequest);
router.get("/all-request", getMyAllFriendRequestNotifications);
router.put("/accept-request", acceptRequest);
router.get("/get-my-friends", getMyAllFriends);

export default router;
