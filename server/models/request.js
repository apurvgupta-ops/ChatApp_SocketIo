import mongoose, { Schema, Model, model } from "mongoose";
import { Types } from "mongoose";

const RequestSchema = new Schema(
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

export const Request =
  mongoose.models.Request || model("Request", RequestSchema);
