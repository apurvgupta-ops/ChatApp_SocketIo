import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import UserRoutes from "./routes/user.js";
import ChatRoutes from "./routes/chat.js";
import { dbConnect } from "./utils/dbConnect.js";
import { errorMiddleware } from "./middlewares/error.js";
import { createUser } from "./seeders/fakeData.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/event.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./utils/features.js";
import { Message } from "./models/message.js";

dotenv.config();

// For create a fake Users
// createUser(10);

const app = express();
const server = createServer(app);
const io = new Server(server, {});

// DB connection
const mongoUrl = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
export const userSocketIds = new Map();

dbConnect(mongoUrl);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // to use cookies in the system
  })
);

// Attach External routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/chat", ChatRoutes);

// testing route
app.get("/", (req, res) => {
  res.send("Testing");
});

// Make Connection with IO.
io.on("connection", (socket) => {
  const user = {
    _id: "1234",
    name: "Apurv",
  };

  userSocketIds.set(user._id.toString(), socket.id);
  console.log("User Connected", userSocketIds);

  // For New Messages
  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDb = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSockets = getSockets(members);
    console.log({ membersSockets });
    // sending response fromm the server.
    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });

    console.log({ messageForRealTime });

    try {
      await Message.create(messageForDb);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", (socket) => {
    console.log("user disconnected", socket.id);
    userSocketIds.delete(user._id.toString());
  });
});

// Error handling middleware
app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running ${port}`);
});
