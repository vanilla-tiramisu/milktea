const { baseURL, apiKey, model, } = require('../config/config');
const OpenAI = require('openai');
const { addMemo } = require('../models/Memory');


/**
 * 对之前的会话进行总结和存储
 * @param {any[]} history 
 */
async function SessionJudgment(history) {
    // 首先分析用户是否开启了新会话
    // 然后返回回应
    // const cleanedText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
    try {
        // 构造提示词（保持原模板格式）
        // console.log("history before process:", JSON.stringify(history));

        const completion = await new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
        }).chat.completions.create({
            messages: [{
                role: "system",
                content: `
                    你是一个专业的信息提取AI，请从以下对话（历史记录）中判定是否开启了新对话；
                    如果开启了新会话，则逐条总结此前的会话中的关键内容；如果不能判定，则看做没有开启新对话。
                    一般会话长度为5条信息左右，不用包括一般的寒暄。
                    提取会话中关键内容时，尽量提取和用户喜好或经历相关的内容，可以忽略无实质性意义的内容。
                    按照以下格式输出：
                    按JSON格式输出，不要包含任何其他内容。JSON字段：
                        - new_session：是否开启新对话
                        - key_points: （new_session==true时输出）数组形式的核心信息点，尤其是有关用户的信息
                        - sentiment: （new_session==true时输出）情感分析结果（positive/neutral/negative），数值为介于0~1之间的浮点数
                        - error：（可选）解析是否出现问题，若出现，则给出问题描述。
                    比如：
                    "new_session":true,
                    "error":false,
                    "key_points": [
                        {"type": "project_update", "content": "用户正在写一个AI聊天应用，应用新版本即将发布。"},
                        {"type": "personal_story", "content": "用户提起自己小学时骑车摔掉门牙，门牙因此缺了一块"}
                    ],
                    "sentiment": {"positive": 0.7, "humor": 0.9},
                    现会话如下，请给出回应：${JSON.stringify(history)}
                    `,
            }],
            model: model,
            response_format: { type: "json_object" }, // 强制返回JSON
        });
        // 解析结果（保持原校验逻辑）
        const result = JSON.parse(completion.choices[0].message.content);
        if (result.error) {
            console.error(`实体解析失败: ${result.error}`)
        } else {
            if (result.new_session === true) {
                saveSession(result);
                history = history.slice(-1);
                console.log("session changed:--------------");
                console.log("history now:", history);

            }
        }

    } catch (error) {
        console.error(`实体解析失败: ${error.message}`);
    }
}


async function saveMemory(obj) {
    obj.key_points.forEach(kp => {
        addMemo({ topic: kp })
    });
}


async function saveSession(result) {
    console.log("saveSession:", result);
    delete result.error;
    delete result.new_session;
    try {
        saveMemory(result)
    } catch (error) {
        console.log(error);

    }
}




module.exports = {
    SessionJudgment
};