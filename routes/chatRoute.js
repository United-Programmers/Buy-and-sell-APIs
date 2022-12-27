const router = require('express').Router()
const {createChat, deleteChat} = require('../controllers/chatController');

router.post('/', createChat)
router.delete('/:chatId', deleteChat)


module.exports = router;