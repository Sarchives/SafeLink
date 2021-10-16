const Sequelize = require('sequelize');

const database = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: __basedir + '/data/database.sqlite',
});

module.exports = {
    setupInfo: database.define('setupInfo', {
        guild: {
            type: Sequelize.STRING,
            unique: true,
        },
        logChannel: {
            type: Sequelize.STRING,
            unique: true,
        },
    })
};