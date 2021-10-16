# SafeLink
SafeLink is a Discord bot that's goal is to preotect servers from dangerous links.

## Setup
* Create a `.env` file at the project's root directory and fill out the required keys shown below:
  
```js
DISCORD_TOKEN=
SAFE_BROWSING_API_KEY=
```

- Open the `index.js` file located in the `src` directory and replace the following with values of your own.

```js
client.guild = '886028080290857057'
```

- Invite the bot to your server, you can find the invite link in the developer portal. You can configure permissions there as well.

*Note:* The bot requires that you tick `applications.commands` in the **OAuth2 URL Generator**.

- Execute `npm install` then `npm run start`, and the bot should be up and running!