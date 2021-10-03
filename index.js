require('dotenv').config()
const { initializeDiscordBot } = require('./discordClient')

const main = async () => {
    await initializeDiscordBot()
    require('./bridge')
}

main()