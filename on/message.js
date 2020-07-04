require('dotenv').config();
const prefix = process.env.PREFIX

module.exports = message => {
    if (!message.content.startsWith(prefix))
        return
    message.content = message.content.slice(prefix.length)
    console.log(message.content)
}