# Radeon
Radeon is a multi-functional moderation bot with a cross-server anti-raid system! (soon™️) Self-hosting this bot is not recommended just yet as it is still under major development.

### Contributions
If you want to contribute via suggestions, join Radeon's [**Support Server**](https://discord.gg/xcZwGhSy4G) to make one there or open an issue named "suggestion: \<name-here>" in this Github (without the `<>`).

Contributions via pull-requests should be made to the **dev** or **updates** branch, not the main branch. This is so that we can test the code first before pushing, and makes reverting files easier. :)

**config File Format:**
```json
{
    "prefix":"PREFIX",
    "token":"BOT TOKEN HERE",
    "botOwners":[
        "OWNER IDS"
    ],
    "logs":{
        "event":"EVENT CHANNEL ID",
        "error":"ERROR CHANNEL ID",
        "guilds":"BOT-JOINS CHANNEL ID"
    },
    "MongoPath":"MONGODB PASSWORD KEY"
}
```
