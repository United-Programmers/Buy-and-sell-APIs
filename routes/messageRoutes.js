/* eslint-disable prettier/prettier */
const express = require('express');
const { createMesage, getAllChatMessages } = require('../controllers/messageController');
const router = express.Router();

router.post('/', createMesage)
router.get('/:chatId', getAllChatMessages)


module.exports = router;
