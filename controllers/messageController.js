const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const {ChatModel, CHAT_GROUP} = require("../models/chatModel");
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
  console.log(decodedToken)
  let senderId = decodedToken.id;

  // check chat group and authorize
  if(chatExist.group){
    if(chatExist.group === CHAT_GROUP.ADMIN_TO_SELLERS || chatExist.group === CHAT_GROUP.ADMIN_TO_DRIVERS &&  decodedToken.role !== 'admin'){
      return next(new AppError("You are not authorized to send message", 401))
    }

    if(chatExist.group === CHAT_GROUP.SELLERS_TO_BUYERS &&  decodedToken.role !== 'seller'){
      return next(new AppError("You are not authorized to send message", 401))
    }
  }

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
