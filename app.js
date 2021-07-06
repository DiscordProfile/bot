require('dotenv-flow').config();
const Bot = require('./classes/Bot');
const client = new Bot();


(async function () {
    await client.registerClient();
    require('discord-buttons')(client);
    if (process.env.MODE == 'dev') {
        client.login(process.env.DEV_CLIENT_TOKEN);
    } else {
        client.login(process.env.TOKEN);
    }
})();
