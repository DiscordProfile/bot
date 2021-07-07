const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply('I need a valid user.')

    if (user.bot) return message.reply('You cannot view comments of a bot.') 

    let userDB = await Calls.getUser(user.id)

        let embed = new MessageEmbed()
        .setAuthor(`${userDB.customization.profile_nickname || user.username}'s comments`, user.displayAvatarURL())
        .setDescription(`Viewing <@${user.id}>.`)
        .setColor(userDB.customization.profile_color || '#fd5392')
        .setFooter(user.id)
        .setTimestamp()

        userDB.comments.comments.forEach(comment => {
            embed.addField(comment.value, `by <@${comment.commenter}>`, true)
        })

    message.channel.send(embed)
};

exports.help = {
    name: 'comments',
    aliases: [],
    description: 'Get a users comments.',
    usage: ''
};