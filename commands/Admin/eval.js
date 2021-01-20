const Discord = require('discord.js')

module.exports = {
    name: "eval",
    description: "Access denied!",
    category: 'Dev',
    run: async (client, message, args) => {
        const error = new Discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("0xc846ff")
        .setFooter(`Used by: ${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
        .setTimestamp()
    if(!["332258095264825352", "622146791659405313", "705380719882403902"].includes(message.author.id)) {
        error.setDescription("You are not a bot owner!")
        return message.channel.send(error);
    }
    const embed = new Discord.MessageEmbed()
    .addField("Input", "```js\n" + args.join(" ") + "```");
    if(args[0] === "stats") {
      embed.addField("Output", `\`\`\`diff\n+ Users: ${client.users.cache.size}\n+ Channels: ${client.channels.cache.size}\n+ Guilds: ${client.guilds.cache.size}\n\`\`\``)
      embed.setColor(0xc846ff)
      return message.channel.send(embed);
    }
    try {
        const code = args.join(" ");
            if (!code) { 
                error.setDescription("Please include the code.")
                return message.channel.send(error)
            }
                let evaled;
    
    // This method is to prevent someone that you trust, open the secret shit here.
    if (code.includes(`SECRET`) || code.includes(`TOKEN`) || code.includes("process.env")) {
      evaled = "No, shut up, what will you do it with the token?";
    } else {
      evaled = eval(code);
    }
    
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled, {depth: 0});
    
    let output = clean(evaled);
    if (output.length > 1024) {
      // If the output was more than 1024 characters, we're gonna export them into the hastebin.
      const {body} = await post("https://hastebin.com/documents").send(output);
      embed.addField("Output", `https://hastebin.com/${body.key}.js`).setColor(0xc846ff);
      // Sometimes, the body.key will turn into undefined. It might be the API is under maintenance or broken.
    } else {
      embed.addField("Output", "```js\n" + output + "```").setColor(0xc846ff)
    }
    
    message.channel.send(embed);
    
  } catch (error) {
            let err = clean(error);
            if (err.length > 1024) {
                const {body} = await post("https://hastebin.com/documents").send(err);
                embed.addField("Output", `https://hastebin.com/${body.key}.js`).setColor("RED");
            } else {
                embed.addField("Output", "```js\n" + err + "```").setColor("RED");
            }
    
            message.channel.send(embed);
        }
    }
}

function clean(string) {
    if (typeof text === "string") {
      return string.replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
      return string;
    }
  }
