const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./milktea.db');

// 对话记录模型
const Message = sequelize.define('Message', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isAI: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.JSON // 存储额外信息如时间戳等
    }
});

// 关键信息存储模型
const KeyInfo = sequelize.define('KeyInfo', {
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    context: {
        type: DataTypes.TEXT // 存储获取该信息的上下文
    }
});

(async () => {
    await sequelize.sync();
})();

module.exports = { Message, KeyInfo };
