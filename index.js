const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const axios = require('axios')
const app = new Koa()
const PORT = process.env.PORT || 3000
const DISCORD_HOOK = process.env.DISCORD_HOOK || ''
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''

app.use(bodyParser())

const userMap = {}

const getUsernameForSlackUser = async (user) => {
  if (userMap[user]) return userMap[user]
  const { data } = await axios.get(`https://slack.com/api/users.info?token=${SLACK_BOT_TOKEN}&user=${user}`)
  const username = data.user.real_name || data.user.name
  userMap[user] = username
  return username
}

router.post('/slack/event', async ctx => {
  if (ctx.request.body.challenge) {
    ctx.body = ctx.request.body.challenge
    return
  }
  const eventBody = ctx.request.body
  const { text, channel, user } = eventBody.event
  if (channel !== 'GH0TG19L0') return ctx.status = 200
  if (!text) return ctx.status = 200

  const username = await getUsernameForSlackUser(user)

  const content = `On ${channel}: ${text}`
  const webhookPayload = {
    username,
    content,
  }

  await axios.post(DISCORD_HOOK, webhookPayload)
  ctx.status = 200
})

app.use(router.routes());

app.listen(PORT)