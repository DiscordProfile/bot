const Calls = require('../database/monk')

module.exports = async (client, guild) => {

    const Guild = {
        id: guild.id
    };

    try {
        await Calls.insertGuild(Guild);
    } catch (error) {
        console.error(error);
    }

};