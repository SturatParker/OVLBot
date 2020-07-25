require('dotenv').config();
const prefix = process.env.PREFIX
const winner = require('../commands/winner')
const reset = require('../commands/reset')

module.exports = message => {
    console.log(message.content)
    // Ignore bot users
    if (message.author.bot) {
        return
    }
    // Ignore incorrect prefix
    if (!message.content.startsWith(prefix)) {
        return
    }
    message.content = message.content.slice(prefix.length)
    args = message.content.match(/(?:[^\s"]+|"[^"]*")+/g)
    // Ignore no command
    if (!args.length) {
        return
    }
    command = args[0].toLowerCase()
    args.shift()
    switch (command) {
        case "winner": 
            return winner(message, ...args);
        case "reset":
            return reset(message, ...args)
        default:
            return;
    }

    if (message.content = "ping") {
        message.channel.send("pong")
    }
}