const { MessageAttachment } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'cmdlogs',
    guildOnly: true,
    modOnly: 4,
    run: async (client, message) => {
        let content = '';
        client.cmdlogs.forEach(log => {
            content += `USER: ${log.user}\nCMD: ${log.command}\nCHANNEL: ${log.channel.id} - ${log.channel.type}\nTIME: ${log.time}\n\n`;
        });
        writeFileSync(join(__dirname, '/', '_logs.txt'), content, {flag: 'w+'}, err => console.error(err));
        const buff = readFileSync(join(__dirname, '/', '_logs.txt'));
        const att  = new MessageAttachment(buff, 'Radeon_cmdlogs.txt');
        try {
            message.author.send('Radeon Command Logs', att);
            const msg = await client.infoEmb(`${message.author} I have DMed you the file.\nThis message will autodelete in 5 seconds.`, message);
            setTimeout(() => msg.delete(), 5000);
        } catch (err) {
            client.errEmb(err.message, message);
        }
        message.delete();
    }
}
