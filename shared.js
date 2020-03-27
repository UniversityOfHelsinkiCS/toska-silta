const hardCodedChannelIds = [
  {
    slack_id: 'GH0TG19L0',
    name: 'acual_random'
  }
]

const getChannelName = (channelId) => {
  const channel = hardCodedChannelIds.find(c => c.slack_id === channelId) || {}
  return channel.name
}

const getChannelId = (channelName) => {
  const channel = hardCodedChannelIds.find(c => c.name === channelName) || {}
  return channel.slack_id
}

module.exports = {
  getChannelName,
  getChannelId
}