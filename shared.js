const axios = require('axios')
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''
const MAGIC_FUCK_YOU = /https?:\/\/([a-zA-Z0-9_\-]*\.){1,4}[a-zA-Z0-9_\-\/\-]*\|https?:\/\/([a-zA-Z0-9_\-]*\.){1,4}[a-zA-Z0-9_\-\/\-]*/

const removeShitFromSlackMessage = async (message) => {
  const userIdStrings = message.match(/<@[^]*>/)
    
  if (userIdStrings === null) return message
    
  const userIdStringToUsernameMap = {}
  await Promise.all(userIdStrings.map(async idString => {
    const id = idString.slice(2, -1)
    const user = await getInfoForSlackUser(id)
    userIdStringToUsernameMap[idString] = user.username
  }))
    
  const parsedMessage = message.replace(/<@[^]*>/, (match) => `@${userIdStringToUsernameMap[match]}`).replace(MAGIC_FUCK_YOU, '')
  return unescape(parsedMessage)
}

const userMap = {}
const getInfoForSlackUser = async (user) => {
  if (userMap[user]) return userMap[user]
  const { data } = await axios.get(`https://slack.com/api/users.info?token=${SLACK_BOT_TOKEN}&user=${user}`)
  const info = {
    username: data.user.profile.display_name || data.user.real_name || data.user.name,
    avatar_url: data.user.profile.image_72,
  }
  userMap[user] = info
  return info
}

const channelMap = {}
const getNameForSlackChannel = async (channelId) => {
  if (channelMap[channelId]) return channelMap[channelId]
  const { data } = await axios.get(`https://slack.com/api/conversations.info?token=${SLACK_BOT_TOKEN}&channel=${channelId}`)
  const channelName = data.channel.name
  channelMap[channelId] = channelName
  return channelName
}


module.exports = {
  removeShitFromSlackMessage,
  getInfoForSlackUser,
  getNameForSlackChannel
}