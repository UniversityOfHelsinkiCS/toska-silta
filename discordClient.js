const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
const { Client, Intents } = require('discord.js');

const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
];

const client = new Client({ intents });
client.login(DISCORD_BOT_TOKEN)

module.exports = client
