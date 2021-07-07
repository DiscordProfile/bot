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
    .setTitle('Global Statistics')
    .setDescription('Total amounts given.')
    .addField('❤️ Hearts', allHearts, true)
    .addField('👀 Views', allViews, true)
    .setColor('#88E595')
    .setTimestamp()

    message.channel.send(embed)

};

exports.help = {
    name: 'stats',
    aliases: [],
    description: 'Get a users profile or your own profile.',
    usage: ''
};