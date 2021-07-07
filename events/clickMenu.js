const Calls = require('../database/monk');
const { MessageEmbed } = require("discord.js")
const { MessageButton, MessageActionRow } = require("discord-buttons")

module.exports = async (client, menu) => {
    await menu.clicker.fetch();
    await menu.reply.defer();
    if(menu.message.embeds[0].footer.text != String(menu.clicker.user.id)) return;

    let quote = "xx", nick = "xx", nationality = "x", gender = "x", age = "x";
    let profileEditInfoExample = [
        `Customizing <@${menu.clicker.user.id}>.`
        `Quote: ${quote || "?"}`,
        ``,
        `Nickname: ${nick || "?"}`,
        `Nationality: ${nationality || "?"}`,
        `Gender: ${gender || "?"}`,
        `Age: ${age || "?"}`
    ].join("\n");

    let id = menu.id;
    let cId = String(menu.values[0]).split("_")[1]
    let needInput = ["profilepicture", "profilequote", "profilecolor", "profilenickname", "profilenationality", "profileage", "profilesocial"] //yes

    if(needInput.some(n => n == cId)) {
        let waitingForInput = await menu.channel.send("Waiting for input...")

        const filter = async(message) => menu.clicker.user.id == message.author.id
        let input = await menu.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });

        let finalInput = input ? input.first() : ""; 

        switch (cId) {
            case "profilepicture" : menu.message.embeds[0]["thumbnail"] = { url: finalInput.content || menu.clicker.user.avatarURL({dynamic: true}) }; break; 
            case "profilecolor" : menu.message.embeds[0]["color"] = finalInput.content; break; 
            default: menu.message.embeds[0]["description"] = profileEditInfoExample; break;
        } 

        //Changed the code below into a switch feel free to delete it if you don't like it <3 Bacio

        // if(cId == "profilepicture") menu.message.embeds[0]["thumbnail"] = { url: finalInput.content || menu.clicker.user.avatarURL({dynamic: true}) }
        // else if(cId == "profilecolor") menu.message.embeds[0]["color"] = finalInput.content
        // else {
        //     menu.message.embeds[0]["description"] = profileEditInfoExample;
        // }

        waitingForInput.delete();
        if(finalInput.content) finalInput.delete();
        menu.message.edit(menu.message.embeds[0])
    } else {
        if(cId == "profilegender") {
            let selectGender = await menu.channel.send(`Select gender.`, {
                components: new MessageActionRow().addComponents([
                    new MessageButton().setLabel("Man").setID(`customizationSelect_profilegender:man`).setStyle("blurple"),
                    new MessageButton().setLabel("Woman").setID(`customizationSelect_profilegender:woman`).setStyle("red")
                ])
            })

            const filter = async(btn) => menu.clicker.user.id == btn.clicker.user.id
            let input = await selectGender.awaitButtons(filter, {max: 1, time: 30000});
            input.first().reply.defer();

            gender = input.first().id.split("_")[1].split(":")[1];
        }
    }

    // db.set(`user_id`, {cId: etc}) 

    menu.message.edit(menu.message.embeds[0])
}