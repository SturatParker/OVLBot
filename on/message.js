require('dotenv').config();
const prefix = process.env.PREFIX

module.exports = message => {
    if (message.author.bot)
        return
    console.log(message.content)
    if (!message.content.startsWith(prefix))
        return
    message.content = message.content.slice(prefix.length)
    if (message.content = "ping") {
        message.channel.send("pong")
    }
}