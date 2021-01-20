const { MessageEmbed } = require(`discord.js`),
      { post } = require("node-superfetch");

module.exports = {
    name: 'eval',
    aliases: ["ev"],
    guildOnly: true,
    modOnly: true,
run: async (client, message, args) => {

  if (!client.config.botOwners.includes(message.author.id)) return;
  
  const embed = new MessageEmbed()
  .addField("Input", "```js\n" + args.join(" ") + "```");
  
  try {
    const code = args.join(" ");
    if (!code) return message.channel.send("Please include the code.");
    let evaled;
    
    if (code.includes(`SECRET`) || code.includes(`TOKEN`) || code.includes("process.env") || code.includes("secret") || code.includes("token") || code.includes("PROCESS.ENV")) {
      evaled = "LMFAO, you think im stoopid??";
    } else {
      evaled = JSON.stringify(eval(code),null,2);
    }
    
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled, {depth: 0});
    
    let output = clean(evaled);
    if (output.length > 1024) {
      const {body} = await post("https://hastebin.com/documents").send(output);
      embed.addField("Output", `https://hastebin.com/${body.key}.js`).setColor('YELLOW')
    } else {
      embed.addField("Output", "```js\n" + output + "```").setColor('YELLOW')
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
}}

function clean(string) {
  if (typeof text === "string") {
    return string.replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
  } else {
    return string;
  }
}
