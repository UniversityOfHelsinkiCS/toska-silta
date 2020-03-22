const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const axios = require('axios')
const app = new Koa()
const PORT = process.env.PORT || 3000
const DISCORD_HOOK = process.env.DISCORD_HOOK || ''

app.use(bodyParser())


router.post('/slack/event', async ctx => {
  if (ctx.request.body.challenge) {
    ctx.body = ctx.request.body.challenge
    return
  }
  const eventBody = ctx.request.body
  const { text, channel, user } = eventBody.event
  if (channel !== 'GH0TG19L0') return ctx.status = 200
  if (!text) return ctx.status = 200

  const content = `On ${channel}: ${text}`
  const webhookPayload = {
    username: user,
    content,
  }

  await axios.post(DISCORD_HOOK, webhookPayload)

  ctx.status = 200
})

app.use(router.routes());

app.listen(PORT)