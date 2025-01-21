import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroup } from "../controller/chat.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/new-group", newGroup);

export default router;
