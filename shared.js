const axios = require('axios')
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''

const removeShitFromSlackMessage = async (message) => {
  let parsedMessage = message

  const username_regex = /<@[^>]+>/g
  const userIdStrings = parsedMessage.matchAll(username_regex)
  if (userIdStrings !== null) {
    const userIdStringToUsernameMap = {}
    await Promise.all(userIdStrings.map(async idString => {
      if (!(idString in userIdStringToUsernameMap)) {
        const id = idString.slice(2, -1)
        const user = await getInfoForSlackUser(id)
        userIdStringToUsernameMap[idString] = user.username
      }
    }))
    parsedMessage = parsedMessage.replaceAll(username_regex, (match) => `@${userIdStringToUsernameMap[match]}`)
  }

  const embed_url_regex = /<[^>|]+\.[^>|]+\|([^>]+\.[^>]+)>/g
  parsedMessage = parsedMessage.replaceAll(embed_url_regex, '$1')

  const decodeHtmlCharCodes = str => 
    str.replaceAll(/(&#(\d+);)/g, (match, capture, charCode) => 
      String.fromCharCode(charCode));
  parsedMessage = decodeHtmlCharCodes(parsedMessage)

  return parsedMessage
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
