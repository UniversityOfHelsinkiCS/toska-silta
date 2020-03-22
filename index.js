require('dotenv').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const axios = require('axios')
const FormData = require('form-data')
const app = new Koa()
const PORT = process.env.PORT || 3000
const DISCORD_HOOK = process.env.DISCORD_HOOK || ''
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''

app.use(bodyParser())

const hardCodedChannelIds = {
  'GH0TG19L0': 'acual_random'
}

const userMap = {}

const getInfoForSlackUser = async (user) => {
  if (userMap[user]) return userMap[user]
  const { data } = await axios.get(`https://slack.com/api/users.info?token=${SLACK_BOT_TOKEN}&user=${user}`)
  const info = {
    username: data.user.real_name || data.user.name,
    avatar_url: data.user.profile.image_72,
  }
  userMap[user] = info
  return info
}

const handleSlackFile = async (ctx, event) => {
  const { user_id, file_id } = event
  const fileInfoUrl = `https://slack.com/api/files.info?token=${SLACK_BOT_TOKEN}&file=${file_id}`
  const { data: fileData } = await axios.get(fileInfoUrl)
  const userInfo = await getInfoForSlackUser(user_id)
  const actualFileUrl = fileData.file.url_private_download
  const { data } = await axios.get(actualFileUrl, { responseType: 'stream', headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` }})
  const form = new FormData()
  form.append('username', userInfo.username)
  form.append('avatar_url', userInfo.avatar_url)
  form.append('file', data)
  form.submit(DISCORD_HOOK)

  ctx.status = 200
}

router.post('/slack/event', async ctx => {
  console.log(ctx.request.body)
  if (ctx.request.body.challenge) {
    ctx.body = ctx.request.body.challenge
    return
  }
  const eventBody = ctx.request.body
  const { text, channel, user, type } = eventBody.event
  if (type === 'file_created') return handleSlackFile(ctx, eventBody.event)

  const channelName = hardCodedChannelIds[channel]
  if (!channelName) return ctx.status = 200
  if (!text) return ctx.status = 200

  const { username, avatar_url } = await getInfoForSlackUser(user)

  const content = `${text}`
  const webhookPayload = {
    username,
    avatar_url,
    content,
  }

  await axios.post(DISCORD_HOOK, webhookPayload)
  ctx.status = 200
})

app.use(router.routes());

app.listen(PORT)