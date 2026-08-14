import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "model", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    default: "gemini-flash-latest",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: "guest",
      index: true,
    },
    title: {
      type: String,
      default: "New Conversation",
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
