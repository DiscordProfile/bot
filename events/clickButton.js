const Calls = require('../database/monk')
const delay = ms => new Promise(res => setTimeout(res, ms));
const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = async (client, button) => {
    try {
            const userProfile = client.users.cache.get(button.message.embeds[0].footer.text);
            let userProfileDB = await Calls.getUser(userProfile.id)
            const userClicker = button.clicker;
        
            let heartUsers = await userProfileDB.hearts.users

            let hearts = new MessageButton()
            .setStyle('gray')
            .setID('heart')
            .setEmoji('❤️')
            .setLabel(await heartUsers.length)

            let hearts_liked = new MessageButton()
            .setStyle('red')
            .setID('heart')
            .setEmoji(`❤️`)
            .setLabel(`+ ${button.clicker.user.username}`)

            let hearts_unliked = new MessageButton()
            .setStyle('red')
            .setID('heart')
            .setEmoji(`❤️`)
            .setLabel(`- ${button.clicker.user.username}`)
        
            let views = new MessageButton()
            .setStyle('gray')
            .setID('views')
            .setEmoji('👀')
            .setLabel(userProfileDB.views.total + ' views')
            .setDisabled()

            let reload = new MessageButton()
            .setStyle('gray')
            .setID('reload')
            .setEmoji('861934606956888064')

            let reloading = new MessageButton()
            .setStyle('blurple')
            .setID('reload')
            .setEmoji('861933148228026389')
            .setLabel('Reloading')
            .setDisabled()

            async function updateUser(profile, db_field, clicker, tmr) {
                return new Promise(async function(resolve, reject) {
                    await Calls.updateUserPushOrPull(profile.id, db_field, clicker.id, tmr).then(r => {
                        resolve()
                    }).catch(e => reject())
                })
            }
            
            async function updateEmbed(type) {
                return new Promise(async function(resolve, reject) {
                    client.channels.cache.get(button.channel.id).messages.fetch(button.message.id).then(async m => {
                        
                        userProfileDB = await Calls.getUser(userProfile.id);
                        heartUsers = await userProfileDB.hearts.users;

                        hearts = new MessageButton()
                        .setStyle('gray')
                        .setID('heart')
                        .setEmoji('❤️')
                        .setLabel(heartUsers.length)

                        m.edit({embed: button.message.embeds[0], buttons: [type, views]})
                        await delay(2500)
                        m.edit({embed: button.message.embeds[0], buttons: [hearts, views, reload]}).then(r => resolve())
                    })
                })
            }

        if (button.id === 'heart') {
            await button.reply.defer()

            if (userProfile.id === userClicker.id) return button.message.channel.send('You cannot heart your own profile!')        

            if (heartUsers.includes(button.clicker.user.id)) {
                // remove the heart
                await updateUser(userProfile, 'hearts.users', userClicker, false)
                await updateEmbed(hearts_unliked)
            } else {
                // add the heart
                await updateUser(userProfile, 'hearts.users', userClicker, true)
                await updateEmbed(hearts_liked)
            }
        }        
        
        if (button.id === 'reload') {
            await button.reply.defer()

            if (userClicker.id !== userProfileDB.id) await Calls.updateUser(userProfileDB.id, 'views.total', userProfileDB.views.total + 1)

            client.channels.cache.get(button.channel.id).messages.fetch(button.message.id).then(async m => {
                m.edit({embed: button.message.embeds[0], buttons: [hearts, views, reloading]})
                await delay(2500)
                m.edit({embed: button.message.embeds[0], buttons: [hearts, views, reload]})
            })
        }
    } catch (err) {
        console.log(err)
    }

};