const axios = require('axios')
const Discord = require('discord.js');
const channels = require('./shared')
const client = new Discord.Client();
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) return
  if (msg.channel.name !== 'acual_random') return
  const channelName = msg.channel.name
  const username = msg.member.nickname || msg.author.username
  const payload = {
    username,
    channel: channels.getChannelId(channelName),
    "text": msg.content,
    icon_url: msg.author.displayAvatarURL({ format: 'png' })
  }
  const url = 'https://slack.com/api/chat.postMessage'
  axios.post(url, payload, { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` }})
});

client.login(DISCORD_BOT_TOKEN);