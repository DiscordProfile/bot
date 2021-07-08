const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    let allUsers = await Calls.getAllUsers()

    let allHearts = 0
    let allViews = 0

    allUsers.forEach(user => {
        allHearts += user.hearts.users.length
        allViews += user.views.total
    })

    let embed = new MessageEmbed()
    .setTitle('Global Bot Statistics')
    .setDescription('Total amounts given for the whole of the bot.')
    .addField('❤️ Hearts', allHearts, true)
    .addField('👀 Views', allViews, true)
    .setColor('#fd5392')
    .setTimestamp()

    message.channel.send(embed)

};

exports.help = {
    name: 'stats',
    aliases: [],
    description: 'Get a users profile or your own profile.',
    usage: ''
};