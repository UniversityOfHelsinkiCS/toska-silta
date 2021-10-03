const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [] });
client.login(DISCORD_BOT_TOKEN)

module.exports = client
