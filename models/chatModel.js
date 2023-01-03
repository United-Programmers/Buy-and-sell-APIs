const mongoose = require("mongoose");

const CHAT_GROUP = {
  ADMIN_TO_SELLERS: 'ADMIN_TO_SELLERS',
  ADMIN_TO_DRIVERS: 'ADMIN_TO_DRIVERS',
  SELLERS_TO_BUYERS: 'SELLERS_TO_BUYERS'
}

const chatSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      default: null
    },
    members: {
      type: Array,
    },
    isGeneral: {
      type: Boolean,
      default: false,
    },
    group: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = {ChatModel, CHAT_GROUP};
