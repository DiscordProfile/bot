  
const { MessageEmbed } = require('discord.js');
const Calls = require('../database/monk');

exports.run = async (client, message, args) => {
    let guild = await Calls.getGuild(message.guild.id)
        var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd
            allcmds+="`"+guild.guild_prefix+cmdinfo.help.name+" "+cmdinfo.help.usage+"` ~ "+cmdinfo.help.description+"\n"
        })

        let embed = new MessageEmbed()
        .setAuthor('DiscordProfiles | Help', client.user.avatarURL())
        .setColor("#fd5392")
        .setDescription(allcmds)
        .setFooter(`To get info of each command you can do ${guild.guild_prefix}help [command]`)

        if(!args[0])return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if(!command)command = client.commands.find(x => x.help.aliases.includes(cmd))
            if(!command)return message.channel.send("Unknown Command")
            let commandinfo = new MessageEmbed()
            .setTitle("Command: "+command.help.name+" info")
            .setColor("#fd5392")
            .setDescription(`
            Name: ${command.help.name}
            Description: ${command.help.description}
            Aliases: ${command.help.aliases.join(", ")}
            `)
            message.channel.send(commandinfo)
        }
};
exports.help = {
    name: 'help',
    aliases: ['h'],
    description: 'Get the help embed for the bot',
    usage: ''
};