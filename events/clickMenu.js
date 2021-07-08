const Calls = require('../database/monk');
const { MessageEmbed } = require("discord.js")
const { MessageButton, MessageActionRow } = require("discord-buttons")
const { ifUrl } = require("../utils/utils");
const { isHexValid } = require("../utils/utils");
const crypto = require('crypto')

module.exports = async (client, menu) => {
    await menu.clicker.fetch();
    await menu.reply.defer();

    async function customise() {
        if (menu?.message?.embeds[0]?.footer?.text != String(menu.clicker.user.id)) return;
            let userId = menu.clicker.user.id, 
            gender = "x", 
            age = "x";
        let userDB = await Calls.getUser(userId);

        let profileEditInfoExample = [
            `Customizing <@${userId}>.`,
            `Quote: ${userDB.customization ? userDB.customization.profilequote : "?"}`,
            ``,
            `Nickname: ${userDB.customization ? userDB.customization.profilenickname : "?"}`,
            `Nationality: ${userDB.customization ? userDB.customization.profilenationality : "?"}`,
            `Gender: ${userDB.customization ? userDB.customization.profilegender : "?"}`,
            `Age: ${userDB.customization ? userDB.customization.profileage : "?"}`
        ].join("\n");

        let cId = String(menu.values[0])
        let needInput = ["profile_picture", "profile_quote", "profile_color", "profile_nickname", "profile_nationality", "profil_eage", "profile_social"] //yes

        console.log(cId)

        if(needInput.some(n => n == cId)) {
            let waitingForInput = await menu.channel.send("Waiting for input...")

            const filter = async(message) => message.author.id == userId
            let input = await menu.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });

            let finalInput = input ? input.first() : ""; 

            switch (cId) {
                case "profile_picture": {
                    let finalUrl = ifUrl(finalInput.content) ? finalInput.content : menu.clicker.user.avatarURL({dynamic: true}) 
                    await Calls.updateUser(userId, `customization.${cId}`, finalUrl)

                    menu.message.embeds[0]["thumbnail"] = { 
                        url: finalUrl
                    }; 
                    break;
                } 
                case "profile_color": {
                    if (ifUrl(finalInput.content)) return;
                    if (!isHexValid(finalInput.content)) return; 

                    await Calls.updateUser(userId, `customization.${cId}`, finalInput.content)

                    menu.message.embeds[0]["color"] = finalInput.content;

                    break; 
                }
                case "profile_nickname": {
                    if (ifUrl(finalInput.content)) return;
                    await Calls.updateUser(userId, `customization.${cId}`, finalInput.content)

                    //Change Nickname on embed to new nick

                    break;
                }
                case "profile_quote": {
                    if (ifUrl(finalInput.content)) return;
                    console.log(finalInput.content.length )
                    if (finalInput.content.length > 20) return;
                    await Calls.updateUser(userId, `customization.${cId}`, finalInput.content)

                    //Change Quote on embed to new quote

                    break;
                }
                default: {
                    await Calls.updateUser(userId, `customization.${cId}`, finalInput.content)

                    userDB = await Calls.getUser(userId)
                    menu.message.embeds[0]["description"] = profileEditInfoExample; 
                    break;
                }
            }
            waitingForInput.delete();
            if(finalInput.content) finalInput.delete();

            menu.message.edit(menu.message.embeds[0])
        } else {
            if(cId == "profile_gender") {
                let selectGender = await menu.channel.send(`Select gender.`, {
                    components: new MessageActionRow().addComponents([
                        new MessageButton().setLabel("Man").setID(`customizationSelect_profilegender:man`).setStyle("blurple"),
                        new MessageButton().setLabel("Other").setID(`customizationSelect_profilegender:other`).setStyle("green"), //Make prompt to ask gender
                        new MessageButton().setLabel("Woman").setID(`customizationSelect_profilegender:woman`).setStyle("red")
                    ])
                })

                const filter = async(btn) => btn.clicker.user.id == userId
                let input = await selectGender.awaitButtons(filter, {max: 1, time: 30000});
                input.first().reply.defer();

                gender = input.first().id.split("_")[1].split(":")[1];
                await Calls.updateUser(userId, `customization.${cId}`, gender);
                userDB = await Calls.getUser(userId)

                menu.message.edit(menu.message.embeds[0])
                selectGender.delete();
            }
        }
    }
    customise()
    if (menu?.message?.embeds[0]?.footer?.text != String(menu.clicker.user.id)) return;

    if (menu.values[0] == 'comment_niceprofile') {
        await commentSend('👍 Nice Profile!')
    }

    if (menu.values[0] == 'comment_helpful') {
        await commentSend('❤️ Helpful!')
    }

    async function commentSend(value) {
        let profileDB = await Calls.getUser(menu?.message?.embeds[0]?.author?.name)
        let length = 16;
        let id = crypto.randomBytes(length).toString("base64");

        const secondsSinceEpoch = Math.round(Date.now() / 1000)

        await Calls.updateUserPushOrPull(profileDB.id, 'comments.comments', {
            uuid: id,
            commenter: menu.clicker.user.id,
            value: value,
            epoch_timestamp: secondsSinceEpoch
        }, true)

        let comment_embed = new MessageEmbed()
        .setTitle(`Comment Sent!`)
        .setColor('#fd5392')
        .setDescription(`<:comment:862302065321574410> <@${menu.clicker.user.id}> commented: \`${value}\``)
        .setTimestamp()

        client.channels.cache.get(menu.channel.id).messages.fetch(menu.message.id).then(async m => {
            m.delete()
            m.channel.send({
                embed: comment_embed,
                components: []
            })
        })
    }
}