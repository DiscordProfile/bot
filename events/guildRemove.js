const Calls = require('../database/monk')

module.exports = async (client, guild) => {
    try {
        await Calls.removeGuild(guild.id);
    } catch (error) {
        console.error(error);
    }

};