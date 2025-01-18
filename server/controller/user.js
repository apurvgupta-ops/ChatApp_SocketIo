import { User } from "../models/user.js";

const signupController = async (req, res) => {
  try {
    const { name, userName, password, avatar } = req.body;

    await User.create({ name, userName, password, avatar });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
  }
};
const loginController = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};

export { loginController, signupController };
