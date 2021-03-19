<h1><img src="https://cdn.discordapp.com/avatars/762359941121048616/5095536e2741937b837d40ac369a4a7b.png" width=32 height=32 align="top"> Radeon Development</h1></img>

Radeon is a multi-functional moderation bot with an anti-raid system! While still a small bot, it has a powerful and up-to-date moderation system with active development on the anti-raid system. Any and all support is appreciated!

## Commands
`COMMANDS.md` coming soon :^)

## Contributions
If you want to contribute via suggestions, join Radeon's [**Support Server**](https://discord.gg/xcZwGhSy4G) to make one there or open an issue named "suggestion: \<name-here>" in this Github (without the `<>`).

Contributions via pull-requests should be made to the **dev** or **updates** branch, not the main branch. This is so that we can test the code first before pushing, and makes reverting files easier. :)

## Self-Hosting
We recommend **not** self-hosting Radeon as it is too early in development for it, nor do we currently support self-hosted instances. If you have experience with Discord.JS and JavaScript then feel free to try hosting anyway!

**Config File Format:**
```json
{
    "prefix":"PREFIX",
    "token":"BOT_TOKEN_HERE",
    "botOwners":[
        "OWNER_IDS"
    ],
    "botAdmins":[
        "ADMIN_IDS"
    ],
    "logs":{
        "event":"EVENT_CHANNEL_ID",
        "error":"ERROR_CHANNEL_ID",
        "joins":"BOT_JOINS_CHANNEL_ID",
        "guilds":"GUILDS_STATS_CHANNEL_ID",
        "users":"USERS_STATS_CHANNEL_ID"
    },
    "MongoPath":"MONGODB_PASSWORD_KEY"
}
```

## Maintainers
* NaruDevnote - Owner
* tryharddeveloper - Owner
* Piterxyz - Owner

This repository is licensed under the GNU GPL v3 License.