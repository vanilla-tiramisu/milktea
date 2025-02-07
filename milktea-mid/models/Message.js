const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:./milktea.db');

// 对话记录模型
const Message = sequelize.define('Message', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
});


(async () => {
    await sequelize.sync();
})();

module.exports = { Message, };
