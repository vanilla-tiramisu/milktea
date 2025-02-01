const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { handleChatRequest } = require('../controllers/chatController');


router.use(bodyParser.json());

router.post('/default', async (req, res) => {
    handleChatRequest(req, res);
});

module.exports = router;
