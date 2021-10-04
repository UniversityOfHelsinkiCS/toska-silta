const axios = require('axios')
const { client } = require('./discordClient')
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''

const channelMap = {}

const getIdForSlackChannel = async (channelName) => {
  if (channelMap[channelName]) return channelMap[channelName]
  
  const { data } = await axios.get(`https://slack.com/api/conversations.list?token=${SLACK_BOT_TOKEN}&types=public_channel,private_channel`)
  const channel = data.channels.find(c => c.name === channelName)
  if (!channel) return null

  channelMap[channelName] = channel.id
  return channel.id
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.author.bot) return

  const channelId = await getIdForSlackChannel(msg.channel.name)
  if (!channelId) return

  const username = msg.member.nickname || msg.author.username
  console.log('content', msg.content)
  console.log('cleanContent', msg.cleanContent)
  const payload = {
    username,
    channel: channelId,
    "text": msg.content,
    icon_url: msg.author.displayAvatarURL({ format: 'png' })
  }
  const url = 'https://slack.com/api/chat.postMessage'
  axios.post(url, payload, { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` }})
});
