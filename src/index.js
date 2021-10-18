require('dotenv').config();

const { sync } = require('glob');
const { resolve } = require('path');

const { Client, Collection, Intents } = require('discord.js');

global.__basedir = __dirname;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
});

client.database = require('./utils/db');
client.logger = require('./utils/logger');

client.commandArray = [];
client.commands = new Collection();

client.guild = '886028080290857057';

function loadEvents(path) {
    for (const file of sync(resolve(path))) {
        const event = require(file);
        client[event.once ? 'once' : 'on'](event.name, (...args) =>
            event.execute(...args)
        );
    }
}

function loadCommands(path) {
    for (const file of sync(resolve(path))) {
        const command = require(file);
        if (!command.data) return;
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
    }
}

function init() {
    client.database.setupInfo.sync();
    loadEvents(__basedir + '/events/**/*.js');
    loadCommands(__basedir + '/commands/**/*.js');
    client.login(process.env.DISCORD_TOKEN);
}

init();
