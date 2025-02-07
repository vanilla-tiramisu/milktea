const { Pinecone } = require('@pinecone-database/pinecone');
const { pineconeKey } = require('../config/config');
const use = require('@tensorflow-models/universal-sentence-encoder'); // 轻量级文本嵌入模型
const tf = require('@tensorflow/tfjs');
// const use = new UniversalSentenceEncoder();

tf.backend();

const pinecone = new Pinecone({
    apiKey: pineconeKey,
});
const initPinecone = async () => {
    const indexName = 'chat-memories';
    const existingIndexes = await pinecone.listIndexes();
    let created = false;

    for (const idx of existingIndexes.indexes) {
        if (idx.name == indexName) {
            created = true;
        }
    }
    if (!created) {
        await pinecone.createIndex({
            name: indexName,
            dimension: 512,  // 必须与模型输出维度一致
            metric: 'cosine', // 关键：显式指定余弦相似度
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });
    }
    return pinecone.Index(indexName);
};

// 获取或创建索引（单例模式）
let pineconeIndex;
const getIndex = async () => {
    if (!pineconeIndex) {
        pineconeIndex = await initPinecone();
    }
    return pineconeIndex;
};

let model;
const getModel = async () => {
    if (!model)
        model = await use.load();
    return model;
};
// 增强版添加记忆方法
const addMemo = async (memo) => {
    console.log("adding memo", memo);
    try {
        const index = await getIndex();
        const model = await getModel();
        const embeddings = await model.embed(memo.topic.content);
        const vectorValues = Array.from(embeddings.arraySync()[0]);

        // 构建符合Pinecone规范的数据结构
        const vectorData = {
            id: `user_${memo.userId}_${Date.now()}`, // 唯一ID格式
            values: vectorValues,
            metadata: {
                topic: memo.topic.type,
                content: memo.topic.content,
                about: memo.about || 'user',
                userId: memo.userId || 1, // 关键：用于后续过滤查询
                timestamp: memo.date || Date.now()
            }
        };

        // 批量插入（即使单条也建议使用upsert格式）
        const response = await index.upsert(
            [vectorData]
        );

        console.log(`Memory stored with ID: ${vectorData.id}`);
        return vectorData.id;
    } catch (error) {
        console.error('Error saving memory:', error);
        throw new Error('Failed to store memory');
    }
};

// 增强版查询方法（示例）
const searchMemories = async (queryText, userId, topK = 5) => {
    try {
        const index = await getIndex();

        // 生成查询向量
        const embeddings = await model.embed([queryText]);
        const queryVector = Array.from(embeddings.arraySync()[0]);

        // 执行相似度搜索
        const result = await index.query({
            queryRequest: {
                vector: queryVector,
                topK,
                filter: {
                    userId: { $eq: userId } // 关键：过滤当前用户数据
                },
                includeMetadata: true
            }
        });

        return result.matches.map(match => ({
            score: match.score,
            text: match.metadata.topic,
            timestamp: match.metadata.timestamp
        }));
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
};

module.exports = { addMemo, searchMemories };