const OpenAI = require('openai/index.mjs');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
}
);
app.use(cors("http://localhost:5173"));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


const openai = new OpenAI({
    baseURL: 'https://api.moonshot.cn/v1',
    apiKey: 'sk-wW1KyfDEqWwtdzezqm7OEPcri0PnuVY36CyYvBCjCCVDKoVK',
});

app.post('/chat/default', async (req, res) => {
    // console.log(req.body.content);
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "你是一个抽象的小助手，幽默风趣，可以给人们解闷。" },
                { role: "user", content: req.body.content }
            ],
            model: "moonshot-v1-8k",
        });
        let message = completion.choices[0].message.content;
        console.log(message);
        res.send(message);

    } catch (err) {
        if (err.type === 'rate_limit_reached_error') {
            let message = '调用太快了，休息一下吧！';
            console.log(message);
            res.send(message);
        }
        else if (err.type === 'content_filter') {
            let message = '你说的话太难了，我不会回答！';
            console.log(message);
            res.send(message);
        }
        else if (err.type === 'exceeded_current_quota_error') {
            let message = '账户余额不足，请充值后再找我聊天哦！';
            console.log(message);
            res.send(message);
        }
        else {
            let message = '我还不知道怎么回答这个问题呢！';
            console.log(message);
            res.send(message);
        }
    }
});