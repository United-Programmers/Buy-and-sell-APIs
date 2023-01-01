const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    isGeneral: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
