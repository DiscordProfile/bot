const Calls = require('../database/monk')
const delay = ms => new Promise(res => setTimeout(res, ms));
const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = async (client, button) => {
    if(!button.message.embeds[0]) return;
    try {
        const userProfile = client.users.cache.get(button.message.embeds[0].footer.text);
        let userProfileDB = await Calls.getUser(userProfile.id)
        const userClicker = button.clicker;

        let heartUsers = await userProfileDB.hearts.users
        let comment_users = userProfileDB.comments.comments

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

        let commentsBTN = new MessageButton()
            .setStyle('blurple')
            .setID('comment')
            .setEmoji('💬')
            .setLabel(await comment_users.length)

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
            return new Promise(async function (resolve, reject) {
                await Calls.updateUserPushOrPull(profile.id, db_field, clicker.id, tmr).then(r => {
                    resolve()
                }).catch(e => reject())
            })
        }

        async function updateEmbed(type) {
            return new Promise(async function (resolve, reject) {
                client.channels.cache.get(button.channel.id).messages.fetch(button.message.id).then(async m => {

                    userProfileDB = await Calls.getUser(userProfile.id);
                    heartUsers = await userProfileDB.hearts.users;

                    hearts = new MessageButton()
                        .setStyle('gray')
                        .setID('heart')
                        .setEmoji('❤️')
                        .setLabel(heartUsers.length)

                    m.edit({
                        embed: button.message.embeds[0],
                        buttons: [type, commentsBTN, views]
                    })
                    await delay(2500)
                    m.edit({
                        embed: button.message.embeds[0],
                        buttons: [hearts, commentsBTN, views, reload]
                    }).then(r => resolve())
                })
            })
        }

        if (button.id === 'heart') {
            if (userProfile.id === userClicker.id) return button.reply.send('You cannot heart your own profile!', true)

            await button.reply.defer()

            if (heartUsers.includes(button.clicker.user.id)) {
                // remove the heart
                client.channels.cache.get('862259496108425226').send(`<3 <@${userClicker.id}> unhearted <@${userProfile.id}>.`)
                await updateUser(userProfile, 'hearts.users', userClicker, false)
                await updateEmbed(hearts_unliked)
            } else {
                // add the heart
                client.channels.cache.get('862259496108425226').send(`<3 <@${userClicker.id}> hearted <@${userProfile.id}>.`)
                await updateUser(userProfile, 'hearts.users', userClicker, true)
                await updateEmbed(hearts_liked)
            }
        }

        if (button.id === 'comment') {
            let comment_embed = new MessageEmbed()
            .setTitle(`Managing Comments`)
            .setColor('#fd5392')
            .setFooter(userProfile.id)
            .setTimestamp()

            let commentButton = new MessageButton()
            .setStyle('green')
            .setID('comment_send')
            .setEmoji('862302065321574410')
            .setLabel('Comment')

            let viewCommentButton = new MessageButton()
            .setStyle('blurple')
            .setID('view_comments')
            .setEmoji('862302065321574410')
            .setLabel('View Comments')
        
            await button.reply.send({embed: comment_embed, buttons: [viewCommentButton, commentButton]})
        }

        if (button.id === 'comment_send') {
            client.channels.cache.get(button.channel.id).messages.fetch(button.message.id).then(async m => {
                m.delete()
            })

            if (userProfile.id === userClicker.id) return button.reply.send('You cannot comment on your own profile!', true)

            let comment_embed = new MessageEmbed()
            .setAuthor(userProfile.id)
            .setTitle(`${userClicker.user.username} is commenting on ${userProfile.username}'s profile`)
            .setColor('#fd5392')
            .setDescription('*Only pre-made comments are allowed for now.*')
            .setFooter(userClicker.id)
            .setTimestamp()

            let NiceProfileOption = new MessageMenuOption()
            .setLabel(`Nice Profile!`)
            .setEmoji('👍')
            .setValue('comment_niceprofile')

            let HelpfulOption = new MessageMenuOption()
            .setLabel(`Helpful`)
            .setEmoji('❤️')
            .setValue('comment_helpful')
    
            let commentsMenu = new MessageMenu()
            .setID('profileEditMenu')
            .setPlaceholder('What would you like to comment?')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions([NiceProfileOption, HelpfulOption])
        
            await button.reply.send({embed: comment_embed, component: new MessageActionRow().addComponent(commentsMenu)})
        }

        if (button.id === 'view_comments') {
            client.channels.cache.get(button.channel.id).messages.fetch(button.message.id).then(async m => {
                m.delete()
            })
            let userDB = await Calls.getUser(userProfile.id)

            let embed = new MessageEmbed()
            .setAuthor(`${userDB.customization.profile_nickname || userProfile.username}'s comments`, userProfile.displayAvatarURL())
            .setDescription(`Viewing <@${userProfile.id}>.`)
            .setColor(userDB.customization.profile_color || '#fd5392')
            .setFooter(userProfile.id)
            .setTimestamp()
            if (userDB.comments.comments.length == 0) embed.addField('No Comments!', `This user has no comments.`, true)

            userDB.comments.comments.forEach(comment => {
                embed.addField(comment.value, `by <@${comment.commenter}>`, true)
            })
    
            await button.reply.send({embed: embed, ephemeral: true})
        }

        if (button.id === 'reload') {
            await button.reply.defer()

            client.channels.cache.get(button.channel.id).messages.fetch(button.message.id).then(async m => {
                m.edit({
                    embed: button.message.embeds[0],
                    buttons: [reloading]
                })
                await delay(2500)
                m.edit({
                    embed: button.message.embeds[0],
                    buttons: [hearts, commentsBTN, views, reload]
                })
            })
        }
    } catch (err) {
        console.log(err)
    }
};