const { baseURL, apiKey, model, } = require('../config/config');
const { history, processConversation, getHistoryFromDb } = require('../services/chatService');
const OpenAI = require('openai');

const handleChatRequest = async (req, res) => {
    try {
        let userMessage = { role: "user", content: req.body.content };
        processConversation(userMessage);
        const completion = await new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
        }).chat.completions.create({
            messages: history,
            model: model,
        });
        let systemMessage = completion.choices[0].message;
        res.send(systemMessage.content);
        processConversation(systemMessage); // 需要保留，因为有
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
        message = '系统问题，请稍后再试';
    }
    console.log(err, message);
    return message;
};

const getHistory = async (req, res) => {
    try {
        const messages = await getHistoryFromDb();
        // console.log(messages);

        res.send(messages);
    } catch (err) {
        console.log(err);
        res.send("获取历史记录失败");
    }
}



module.exports = {
    handleChatRequest,
    getHistory
};