import mongoose, { Schema, Model, model } from "mongoose";
import { Types } from "mongoose";

const UserSchema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.UserSchema || model("UserSchema", UserSchema);
