const fetch = require('request-promise-native');

module.exports = async function checkLinks(client, message) {
    const cleanMessage = message
        .replace(/<((!?\d+)|(:.+?:\d+))>/g, '')
        .replace(/<.+?(:\d+):.+?>/g, '');
    const linkArray = [];

    cleanMessage.split(/\s/).forEach((word) => {
        const wordMatchArray = word
            // Unedited pattern from: https://www.urlregex.com/
            // eslint-disable-next-line no-useless-escape
            .match(/((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);

        if (wordMatchArray) {
            if (!wordMatchArray[1]) return;
            linkArray.push(wordMatchArray[1]);
        }
    });

    if (linkArray.length > 0) {
        try {
            const response = {
                method: 'POST',
                uri: `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.SAFE_BROWSING_API_KEY}`,
                body: {
                    client: {
                        clientId: process.name,
                        clientVersion: process.version,
                    },
                    threatInfo: {
                        threatTypes: [
                            'MALWARE',
                            'POTENTIALLY_HARMFUL_APPLICATION',
                            'SOCIAL_ENGINEERING',
                            'THREAT_TYPE_UNSPECIFIED',
                            'UNWANTED_SOFTWARE',
                        ],
                        platformTypes: ['ANY_PLATFORM'],
                        threatEntryTypes: ['URL'],
                        threatEntries: [],
                    },
                },
                json: true,
            };
            linkArray.forEach(async (match) => {
                response.body.threatInfo.threatEntries.push({ url: match });
            });
            return { response: await fetch(response) };
        } catch (err) {
            client.logger.error(
                process.env.NODE_ENV === 'production' ? err.message : err.stack
            );
            return { response: { matches: undefined } };
        }
    } else {
        return { response: { matches: undefined } };
    }
};
