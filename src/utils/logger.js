module.exports = require('pino')({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: true,
            ignore: 'pid,hostname',
        },
    },
});