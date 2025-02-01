const { model } = require('../config/config');
const { openai, history, processConversation, getHistoryFromDb } = require('../services/chatService');

const handleChatRequest = async (req, res) => {
    try {
        let userMessage = { role: "user", content: req.body.content };
        history.push(userMessage);
        processConversation(userMessage);
        const completion = await openai.chat.completions.create({
            messages: history,
            model: model,
        });
        let systemMessage = completion.choices[0].message;
        history.push(systemMessage);
        res.send(systemMessage.content);
        processConversation(systemMessage);
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

const getHistory = async (req, res) => {
    try {
        const messages = await getHistoryFromDb();
        console.log(messages);

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