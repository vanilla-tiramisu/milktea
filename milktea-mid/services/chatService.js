const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { ConversationSummaryMemory } = require('langchain/memory');
// const { ChatOpenAI } = require('langchain/chat_models/openai');
const OpenAI = require('openai');
const { baseURL, apiKey } = require('../config/config');
const { Message, KeyInfo } = require('../models');

const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
});

let history = [
    { role: "system", content: "你是一个抽象的小助手，说话搞笑，可以给人们解闷。" }
];

// 对话压缩处理
const processConversation = async (userId) => {
    // 获取所有对话记录的数量
    const totalMessages = history.length;

    // 如果对话记录数量大于等于 20，获取最远的 10 条原始对话
    let messages;
    if (totalMessages >= 20) {
        messages = history.slice(0, 10);
    } else {
        messages = history.slice(-20);
    }

    // 使用LangChain进行摘要处理
    const memory = new ConversationSummaryMemory({
        llm: new ChatOpenAI({ modelName: "openai指定的模型" }), // 使用OpenAI指定的模型
        memoryKey: "chat_history"
    });

    // 添加历史记录
    messages.reverse().forEach(msg => {
        memory.chatHistory.addMessage(msg.isAI ?
            { type: 'ai', text: msg.content } :
            { type: 'human', text: msg.content });
    });

    // 生成摘要
    const summary = await memory.predictNewSummary(
        memory.chatHistory.messages,
        "以下是对话的摘要："
    );

    // 将摘要存储到 SQLite 数据库中
    await KeyInfo.create({
        key: `summary_${userId}`,
        value: summary,
        context: "对话摘要"
    });
};

module.exports = {
    openai,
    history,
};