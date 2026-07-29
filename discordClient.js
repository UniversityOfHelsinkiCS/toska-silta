const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
const { Client, GatewayIntentBits } = require('discord.js');

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
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
