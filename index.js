require('dotenv').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const PORT = process.env.PORT || 3000

require('./discordClient')

require('./routerDiscordToSlack')

app.use(bodyParser())

const routerSlackToDiscord = require('./routerSlackToDiscord')

app.use(routerSlackToDiscord.routes());

app.listen(PORT)