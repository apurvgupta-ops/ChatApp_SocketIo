import mongoose, { Schema, Model, model, Types, Types } from "mongoose";

const ChatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupName: {
      type: Boolean,
      required: true,
      default: true,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    message: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Chat =
  mongoose.models.ChatSchema || model("ChatSchema", ChatSchema);
