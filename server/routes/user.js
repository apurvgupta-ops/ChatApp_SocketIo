import express from "express";
import {
  getProfile,
  loginController,
  signupController,
} from "../controller/user.js";
import { singleFile } from "../middlewares/uploadFiles.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", singleFile, signupController);
router.post("/login", loginController);

router.get("/me", isAuthenticated, getProfile);

export default router;
