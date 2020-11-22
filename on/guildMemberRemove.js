require('dotenv').config()

const { deleteMember } = require('../db/db')
const { log } = require('../log')

module.exports = guildMember => {
    log(`guildMemberRemoved: ${guildMember.displayName}`)
    return deleteMember(guildMember.id)
}
