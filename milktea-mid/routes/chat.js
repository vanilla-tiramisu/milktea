const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {
    handleChatRequest,
    getHistory
} = require('../controllers/chatController');


router.use(bodyParser.json());

router.get('/history', async (req, res) => {
    getHistory(req, res);
});

router.post('/default', async (req, res) => {
    handleChatRequest(req, res);
});

module.exports = router;
