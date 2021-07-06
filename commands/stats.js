const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply('I need a valid user.')

    if (user.bot) return message.reply('You cannot view profile of a bot.') 

    let userDB = await Calls.getUser(user.id)

    if (message.author.id !== userDB.id) await Calls.updateUser(user.id, 'views.total', userDB.views.total + 1)

    let embed = new MessageEmbed()
    .setAuthor(`${user.username}'s profile`, user.displayAvatarURL())
    .setDescription(`Viewing <@${user.id}>.`)
    .setColor('#88E595')
    .setFooter(user.id)
    .setTimestamp()
    //if ()

    let heart_users = userDB.hearts.users

    let hearts = new MessageButton()
    .setStyle('gray')
    .setID('heart')
    .setEmoji('❤️')
    .setLabel(await heart_users.length)
    
    let views = new MessageButton()
    .setStyle('gray')
    .setID('views')
    .setEmoji('👀')
    .setLabel(userDB.views.total + ' views')
    .setDisabled()

    let reload = new MessageButton()
    .setStyle('gray')
    .setID('reload')
    .setEmoji('861934606956888064')
    message.channel.send({embed, buttons: [hearts, views, reload]})
};

exports.help = {
    name: 'profile',
    aliases: ['stats', 'statistics'],
    description: 'Get a users profile or your own profile.',
    usage: ''
};