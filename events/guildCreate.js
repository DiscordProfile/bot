const Calls = require('../database/monk')

module.exports = async (client, guild) => {
    try {
        client.channels.cache.get('862259150267875338').send(`+ Added to **${guild.name}**\`(${guild.id})\``)
        await Calls.insertGuild(Guild);
    } catch (error) {
        console.error(error);
    }

};