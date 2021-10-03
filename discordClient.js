const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
const Discord = require('discord.js')

const client = new Discord.Client()
client.login(DISCORD_BOT_TOKEN)

module.exports = client
