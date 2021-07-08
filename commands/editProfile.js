const { MessageEmbed } = require('discord.js');
const { MessageMenu, MessageMenuOption, MessageActionRow } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    let userName = message.author.username

    let userDB = await Calls.getUser(message.author.id)

    let embedNoAccess = new MessageEmbed()
    .setDescription(`❎ <@${message.author.id}> is blocked from having a profile`)
    .setColor('RED')

    if (userDB.settings && userDB.settings.blocked == true) return message.channel.send({embed: embedNoAccess})

    let profilePictureEdit = new MessageMenuOption()
        .setLabel(`Profile Picture`)
        .setEmoji('🖼️')
        .setValue('profile_picture')
        .setDescription('Edit your profile picture')

    let profileQuoteEdit = new MessageMenuOption()
        .setLabel(`Profile Quote`)
        .setEmoji('✏️')
        .setValue('profile_quote')
        .setDescription('Edit your profile quote')

    let profileColorEdit = new MessageMenuOption()
        .setLabel('Profile Color')
        .setEmoji('🎨')
        .setValue('profile_color')
        .setDescription('Edit your profile color')

    let profileNickNameEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Nickname`)
        .setEmoji('📛')
        .setValue('profile_nickname')
        .setDescription('Edit your nickname')

    let profileNationalityEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Nationality`)
        .setEmoji('🏳️')
        .setValue('profile_nationality')
        .setDescription('Edit your nationality')

    let profileGenderEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Gender`)
        .setEmoji('🧑‍🤝‍🧑')
        .setValue('profile_gender')
        .setDescription('Edit your gender')

    let profileAgeEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Age`)
        .setEmoji('🔞')
        .setValue('profile_age')
        .setDescription('Edit your age')

    let profileSocialsEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Socials`)
        .setEmoji('📸')
        .setValue('profile_social')
        .setDescription('Edit your socials (max 3)')

    let selectProfileEdit = new MessageMenu()
        .setID('profileEditMenu')
        .setPlaceholder('Choose what you want to customize.')
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions([profilePictureEdit, profileQuoteEdit, profileColorEdit,profileNickNameEdit, profileNationalityEdit, profileGenderEdit, profileAgeEdit, profileSocialsEdit])

    let embed = new MessageEmbed()
        .setAuthor(`${message.author.username}'s profile`, message.author.displayAvatarURL())
        .setDescription(`Customizing <@${message.author.id}>.`)
        .setColor('#fd5392')
        .setFooter(message.author.id)
        .setTimestamp()

    message.channel.send({
        embed: embed,
        component: new MessageActionRow().addComponent(selectProfileEdit)
    });
}

exports.help = {
    name: 'editProfile',
    aliases: ['edit', 'customization'],
    description: 'Edit your own profile.',
    usage: ''
};