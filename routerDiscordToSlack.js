const axios = require('axios')
const Discord = require('discord.js');
const client = new Discord.Client();
const SLACK_HOOK = process.env.SLACK_HOOK || ''
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) return
  if (msg.channel.name !== 'acual_random') return
  const username = msg.member.nickname || msg.author.username
  const payload = {
    "text": msg.content,
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*${username}:*`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": msg.content
        },
      },
    ]
  }
  axios.post(SLACK_HOOK, payload)
});

client.login(DISCORD_BOT_TOKEN);