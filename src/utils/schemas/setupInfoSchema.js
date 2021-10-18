const Sequelize = require('sequelize');

module.exports = {
    guild: {
        type: Sequelize.STRING,
        unique: true,
    },
    logChannel: {
        type: Sequelize.STRING,
    },
};