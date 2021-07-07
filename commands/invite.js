const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    let embed = new MessageEmbed()
    .setAuthor('DiscordProfiles | Invite', client.user.avatarURL())
    .setDescription('[➡️ **Invite Bot**](https://discord.com/api/oauth2/authorize?client_id=861961021357948929&permissions=3694522065&scope=bot)')
    .setColor('#fd5392')
    .setTimestamp()

    message.channel.send(embed)
};

exports.help = {
    name: 'invite',
    aliases: [],
    description: 'Get an invite link to our Discord Support Server.',
    usage: ''
};