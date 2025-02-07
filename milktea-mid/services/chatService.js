const { Message } = require('../models/Message');
const { SessionJudgment } = require('./memoryService');

// initialization
// {
//     role: "system",
//     content: "你是一个善解人意的小助手",
// }
let history = [];

const sendToDatabase = async (message) => {
    await Message.create({
        role: message.role,
        content: message.content,
    });
}

// 结束自身的输出之后进行的后续处理
const processConversation = async (message) => {
    history.push(message);

    sendToDatabase(message);
    SessionJudgment(history);

};

getHistoryFromDb = async () => {
    const messages = await Message.findAll();
    return messages;
}

module.exports = {
    history,
    processConversation,
    getHistoryFromDb
};