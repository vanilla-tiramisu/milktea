const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { ConversationSummaryMemory } = require('langchain/memory');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { Message } = require('../models');

// 对话压缩处理
const processConversation = async (userId) => {
    // 获取最近20条原始对话
    const messages = await Message.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 20
    });

    // 使用LangChain进行摘要处理
    const memory = new ConversationSummaryMemory({
        llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
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

    return {
        summary,
        recentMessages: messages.slice(-5) // 返回最近5条完整消息
    };
};

module.exports = { processConversation };