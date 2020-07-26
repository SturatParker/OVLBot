require('dotenv').config();
const { deleteItem } = require("../db/db")
module.exports = (oldMessage, newMessage) => {
    if (process.env.MODE == "dev") {
        console.log(oldMessage.content, newMessage.content)
    }
    if (oldMessage.channel.id != process.env.CHANNEL) {
        return Promise.resolve()
    }
    // Ignore bot users
    if (oldMessage.author.bot) {
        return
    }
    return deleteItem(oldmessage.id)
}