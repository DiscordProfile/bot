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
        if (userDB.comments.comments.length == 0) embed.addField('No Comments!', `This user has no comments.`, true)

        let reversedComments = userDB.comments.comments.reverse()

        reversedComments.forEach(comment => {
            embed.addField(comment.value, `by <@${comment.commenter}>\n<t:${comment.epoch_timestamp}:R>`, true)
        })

    message.channel.send(embed)
};

exports.help = {
    name: 'comments',
    aliases: [],
    description: 'Get a users comments.',
    usage: ''
};