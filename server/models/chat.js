import mongoose, { Schema, Model, model, Types } from "mongoose";

const ChatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      required: true,
      default: true,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    members: [
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
  mongoose.models.Chat || model("Chat", ChatSchema);
