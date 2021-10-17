const Sequelize = require('sequelize');

const setupInfoSchema = require('./schemas/setupInfoSchema');

const database = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: __basedir + '/data/database.sqlite',
});

module.exports = {
    setupInfo: database.define('setupInfo', setupInfoSchema)
};