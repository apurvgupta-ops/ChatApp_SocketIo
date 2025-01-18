import express from "express";
import { loginController, signupController } from "../controller/user.js";
import { singleFile } from "../middlewares/uploadFiles.js";
const router = express.Router();

router.post("/login", loginController);
router.post("/signup", singleFile, signupController);

export default router;
