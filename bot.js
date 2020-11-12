require("dotenv").config();
const { connect } = require('./db/db')
const { Client } = require("discord.js");
const message = require("./on/message");
const ready = require("./on/ready");
const messageReactionAdd = require("./on/messageReactionAdd");
const messageUpdate = require("./on/messageUpdate")
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
const { loggingBehaviour } = require('./log')

console.log(`Initialising...`)
console.log(`Verbose logging ${loggingBehaviour()? "enabled" : "disabled"}`)

connect()
.then(()=> {
	return bot.login(process.env.DISCORD_TOKEN)
})
.catch(console.log);

bot.on("ready", function() {
	ready(this);
});

bot.on("message", message);
bot.on("messageReactionAdd", messageReactionAdd);
bot.on("messageUpdate", messageUpdate)
