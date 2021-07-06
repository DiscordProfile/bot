
require('dotenv').config()
let config = require('../config.json')

const Logger = require('../utils/Logger.js')

module.exports = async client => {
    Logger.info(`Logged in as ${client.user.tag}!`)
    Logger.info(`        Not using sharding.`)
    client.user.setActivity(config.defaults.statusMessage, { type: config.defaults.statusType })
};
