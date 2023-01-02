const ChatModel = require("../models/chatModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/**
 * create chat
 */
exports.createChat = catchAsync(async (req, res, next) => {
  let { members } = req.body;

  if (!members) {
    return next(new AppError("members must not be empty", 400));
  }

  let chatExist = await ChatModel.findOne({
    members: { $all: [...members] },
  });

  if (chatExist) {
    console.log(chatExist);
    return next(new AppError("Chat with members already exist", 403));
  }

  let newChat = await new ChatModel({
    members: [...members],
  }).save();

  res.status(200).json({
    status: "success",
    data: newChat,
  });
});

/**
 * Delete chat
 */
exports.deleteChat = catchAsync(async (req, res, next) => {
  let { chatId } = req.params;

  const chatExist = await ChatModel.findById(chatId)

  if (!chatExist) {
    return next(new AppError(`Chat with id ${chatId} does not exist`, 404))
  }

  await chatExist.delete();
  res.status(200).json({
    status: "success",
    data: `Chat with id ${chatId} deleted successfully`
  })
});
