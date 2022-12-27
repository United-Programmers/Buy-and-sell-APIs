const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: [true, "Chat id is required"] },
    senderId: { type: String, required: [true, "Sender id is reequired"] },
    text: {
      type: String,
      required: [true, "text must not be empty"],
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;
