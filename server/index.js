import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.js";
import { dbConnect } from "./utils/dbConnect.js";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config();
const app = express();
dbConnect(process.env.MONGODB_URI);
// middlewares
app.use(express.json());
app.use(cookieParser());

// Attach External routes
app.use("/api/v1/users", UserRoutes);

// testing route
app.get("/", (req, res) => {
  res.send("Testing");
});

// Error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
