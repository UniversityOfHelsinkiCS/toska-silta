const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
const { Client, Intents } = require('discord.js');

const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
];

const client = new Client({ intents });

const initializeDiscordBot = async () => {
  await client.login(DISCORD_BOT_TOKEN);
  console.log("Discord bot logged in");
};

module.exports = {
    client,
    initializeDiscordBot
}
