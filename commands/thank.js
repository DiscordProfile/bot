const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    // let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    // if (!user) return message.reply('Please mention a user to thank! 👍')

    // if (user.bot) return message.reply('You cannot thank a bot.') 

    // if (message.author.id == user.id) return message.reply('You cannot thank yourself!')

    // let userDB = await Calls.getUser(user.id)

    // await Calls.updateUser(user.id, 'thanks.total', userDB.thanks.total + 1)

    // let embed = new MessageEmbed()
    // .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
    // .setDescription(`👍 You thanked <@${user.id}>. They now have **${await userDB.thanks.total + 1}** thanks!`)
    // .setColor('#88E595')
    // .setTimestamp()

    // message.channel.send(embed)
};

exports.help = {
    name: 'thank',
    aliases: ['t'],
    description: 'Thank a user for helping you.',
    usage: '',
    cooldown: 3.6e+6,
    cooldown_msg: 'You have already thanked a user in the past hour.'
};