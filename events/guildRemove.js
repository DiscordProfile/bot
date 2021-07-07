const Calls = require('../database/monk')

module.exports = async (client, guild) => {
    try {
        client.channels.cache.get('862259150267875338').send(`- Removed from **${guild.name}**\`(${guild.id})\``)
        await Calls.removeGuild(guild.id);
    } catch (error) {
        console.error(error);
    }

};