const { MessageEmbed } = require('discord.js');
const { MessageMenu, MessageMenuOption, MessageActionRow } = require('discord-buttons');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {

    let userName = message.author.username

    let profilePictureEdit = new MessageMenuOption()
        .setLabel(`Profile Picture`)
        .setEmoji('🖼️')
        .setValue('customization_profilepicture')
        .setDescription('Edit your profile picture')

    let profileQuoteEdit = new MessageMenuOption()
        .setLabel(`Profile Quote`)
        .setEmoji('✏️')
        .setValue('customization_profilequote')
        .setDescription('Edit your profile quote')

    let profileColorEdit = new MessageMenuOption()
        .setLabel('Profile Color')
        .setEmoji('🎨')
        .setValue('customization_profilecolor')
        .setDescription('Edit your profile color')

    let profileNickNameEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Nickname`)
        .setEmoji('📛')
        .setValue('customization_profilenickname')
        .setDescription('Edit your nickname')

    let profileNationalityEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Nationality`)
        .setEmoji('🏳️')
        .setValue('customization_profilenationality')
        .setDescription('Edit your nationality')

    let profileGenderEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Gender`)
        .setEmoji('🧑‍🤝‍🧑')
        .setValue('customization_profilegender')
        .setDescription('Edit your gender')

    let profileAgeEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Age`)
        .setEmoji('🔞')
        .setValue('customization_profileage')
        .setDescription('Edit your age')

    let profileSocialsEdit = new MessageMenuOption()
        .setLabel(`${userName}'s Socials`)
        .setEmoji('🔞')
        .setValue('customization_profilesocial')
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
        .setColor('#88E595')
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