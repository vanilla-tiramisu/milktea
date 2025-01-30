const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
var dotenv = require('dotenv');
dotenv.config();


const openai = new OpenAI({
    baseURL: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
});

let history = [
    { role: "system", content: "你是一个抽象的小助手，说话搞笑，可以给人们解闷。" }
];
router.post('/default', async (req, res) => {
    try {
        history.push({ role: "user", content: req.body.content });
        const completion = await openai.chat.completions.create({
            messages: history,
            model: "moonshot-v1-8k",
        });
        history.push(completion.choices[0].message);
        let message = completion.choices[0].message.content;
        console.log(completion.choices[0].message);
        res.send(message);

    } catch (err) {
        let message;
        if (err.type === 'rate_limit_reached_error') {
            message = '调用太快了，休息一下吧！';
        } else if (err.type === 'content_filter') {
            message = '你说的话太难了，我不会回答！';
        } else if (err.type === 'exceeded_current_quota_error') {
            message = '账户余额不足，请充值后再找我聊天哦！';
        } else {
            message = '我还不知道怎么回答这个问题呢！';
        }
        console.log(err, message);
        res.send(message);
    }
});

module.exports = router;
