const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { ConversationSummaryMemory } = require('langchain/memory');
// const { ChatOpenAI } = require('langchain/chat_models/openai');
const OpenAI = require('openai');
const { baseURL, apiKey, model } = require('../config/config');
const { Message, KeyInfo } = require('../models');

const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
});

let history = [
    { role: "system", content: "你是一个抽象的小助手，说话搞笑，可以给人们解闷。" }
];
// system的怎么处理，这个恐怕还得想一想

const sendToDatabase = async (message) => {
    await Message.create({
        role: message.role,
        content: message.content,
    });
}


// 对话压缩处理
const processConversation = async (message) => {
    sendToDatabase(message);
    // 获取所有对话记录的数量
    const totalMessages = history.length;

    // // 如果对话记录数量大于等于 20，获取并删除最远的 10 条原始对话
    // let messages;
    // if (totalMessages >= 20) {
    //     messages = history.slice(0, 10);
    //     history = history.slice(10);
    // } else {
    //     messages = history.slice(-20);
    // }

    // // 使用LangChain进行摘要处理
    // const memory = new ConversationSummaryMemory({
    //     llm: new ChatOpenAI({ modelName: model }), // 使用OpenAI指定的模型
    //     memoryKey: "chat_history"
    // });

    // // 添加历史记录
    // messages.reverse().forEach(msg => memory.chatHistory.addMessage({ type: msg.type, text: msg.content }));

    // // 生成摘要
    // const summary = await memory.predictNewSummary(
    //     memory.chatHistory.messages,
    //     "以下是对话的摘要："
    // );

    // // 将摘要存储到 SQLite 数据库中
    // await KeyInfo.create({
    //     key: `summary_${userId}`,
    //     value: summary,
    //     context: "对话摘要"
    // });
};
getHistoryFromDb = async () => {
    const messages = await Message.findAll();
    return messages;
}

module.exports = {
    openai,
    history,
    processConversation,
    getHistoryFromDb
};