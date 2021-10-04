const axios = require('axios')
const { client } = require('./discordClient')
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const FormData = require('form-data')

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
  const contentWithCleanedEmojis = msg.cleanContent.replace(/<a?(:[^:]*:)\d+>/g, '$1')


  let payload = {
    username,
    channel: channelId,
    "text": contentWithCleanedEmojis,
    icon_url: msg.author.displayAvatarURL({ format: 'png' })
  }

  const attachments = [...msg.attachments.values()]
  console.log(attachments)
  if (attachments && attachments.length > 0) {

    attachment = attachments[0] // if more than 1, get a job
    console.log(attachment)
    const { data } = await axios.get(attachment.url, {
      responseType: 'stream'
    })
    console.log(data)
    const form = new FormData()
    form.append('content', data)
    
    const url = 'https://slack.com/api/files.upload'
    form.submit(url, { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` }})

    //payload = { ...payload, file: form, title: attachment.filename, initial_comment: attachment.filename }
   // axios.post(url, payload, { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}`, 'Content-Type': 'application/form-data' }})

  }
  else {
    const url = 'https://slack.com/api/chat.postMessage'
    axios.post(url, payload, { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` }})

  }
});
