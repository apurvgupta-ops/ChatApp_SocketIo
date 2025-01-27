import express from "express";
import {
  getProfile,
  loginController,
  logout,
  signupController,
} from "../controller/user.js";
import { singleFile } from "../middlewares/uploadFiles.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", singleFile, signupController);
router.post("/login", loginController);

router.use(isAuthenticated); // if dont need to pass everytime

router.get("/me", getProfile);
router.get("/logout", logout);

export default router;
