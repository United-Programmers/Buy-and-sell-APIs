const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const ChatModel = require("../models/chatModel");
const MessageModel = require("../models/messageModel");

/**
 * create new message
 */
exports.createMesage = catchAsync(async (req, res, next) => {
  let { chatId, text } = req.body;
  let token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  let chatExist = await ChatModel.findById(chatId);
  if (!chatExist) {
    return next(new AppError("Chat not found", 404));
  }

  let decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  let senderId = decodedToken.id;

  let message = await new MessageModel({
    chatId,
    text,
    senderId,
  }).save();

  res.status(200).json({
    status: "success",
    data: message,
  });
});

/**
 * Get all messages in a chat
 */
exports.getAllChatMessages = catchAsync(async (req, res, next) => {
  let { chatId } = req.params;

  let messages = await MessageModel.find({
    chatId,
  });

  res.status(200).json({
    status: "success",
    data: messages,
  });
});
