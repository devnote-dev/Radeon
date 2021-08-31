/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageAttachment } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'cmdlogs',
    guildOnly: true,
    modOnly: 4,
    async run(client, message, args) {
        if (args.length) {
            if (args.lower[0] === 'last') {
                message.delete().catch(()=>{});
                const buff = readFileSync(join(__dirname, '_logs.txt'));
                const att = new MessageAttachment(buff, 'radeon_pastlogs.txt');
                try {
                    await message.author.send({ content: 'Radeon Command Logs', files: [att] });
                    return client.infoEmb('I have DMed you the file.', message).then(m => setTimeout(() => m.delete(), 5000));
                } catch {
                    return client.errEmb('Failed Sending DM. Check that your DMs are enabled.', message);
                }
            } else if (args.lower[0] === 'save') {
                let content = '';
                client.cmdlogs.forEach(
                    log => content += `USER: ${log.user}\nCMD: ${log.command}\nCHANNEL: ${log.channel.id} - ${log.channel.type}\nTIME: ${log.time}\n\n`
                );
                writeFileSync(join(__dirname, '_logs.txt'), content);
                return message.react('<:checkgreen:796925441771438080>').catch(()=>{});
            }
        } else {
            message.delete().catch(()=>{});
            let content = '';
            client.cmdlogs.forEach(
                log => content += `USER: ${log.user}\nCMD: ${log.command}\nCHANNEL: ${log.channel.id} - ${log.channel.type}\nTIME: ${log.time}\n\n`
            );
            const att = new MessageAttachment(Buffer.from(content), 'radeon_cmdlogs.txt');
            try {
                await message.author.send({ content: 'Radeon Command Logs', files: [att] });
                return client.infoEmb('I have DMed you the file.', message).then(m => setTimeout(() => m.delete(), 5000));
            } catch {
                return client.errEmb('Failed Sending DM. Check that your DMs are enabled.', message);
            }
        }
    }
}
