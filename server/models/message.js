import mongoose, { Schema, Model, model, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    content: {
      type: String,
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
    },
    attachment: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message || model("Message", MessageSchema);
