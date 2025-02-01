const { openai, history, } = require('../services/chatService');

const handleChatRequest = async (req, res) => {
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
        const message = handleError(err);
        res.send(message);
    }
};
const handleError = (err) => {
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
    return message;
};
module.exports = {
    handleChatRequest
};