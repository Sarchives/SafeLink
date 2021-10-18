const bent = require('bent');

module.exports = async function checkLinks(client, message) {
    const cleanMessage = message
        .replace(/<((!?\d+)|(:.+?:\d+))>/g, '')
        .replace(/<.+?(:\d+):.+?>/g, '');
    const linkArray = [];

    cleanMessage.split(/\s/).forEach(word => {
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
            const threatEntries = [];
            linkArray.forEach((match) => {
                threatEntries.push({ url: match });
            });
            const formBody = {
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
                    // 'ANY_PLATFORM' will not work for some platforms. Reason unknown.
                    platformTypes: [
                        'PLATFORM_TYPE_UNSPECIFIED',
                        'WINDOWS',
                        'LINUX',
                        'ANDROID',
                        'OSX',
                        'IOS',
                        'CHROME'
                    ],
                    threatEntryTypes: ['URL'],
                    threatEntries,
                },
            };
            const post = bent(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.SAFE_BROWSING_API_KEY}`, 'POST', 'json', 200);
            const response = await post(process.name, formBody);
            return { response };
        } catch (error) {
            client.logger.error(error);
            return { response: { matches: undefined } };
        }
    } else {
        return { response: { matches: undefined } };
    }
};
