require("dotenv").config();
const { connect } = require('./db/db')
const { Client } = require("discord.js");
const message = require("./on/message");
const ready = require("./on/ready");
const messageReactionAdded = require("./on/messageReactionAdd");
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

connect()
.then(()=> {
	return bot.login(process.env.DISCORD_TOKEN)
})
.catch(console.log);

bot.on("ready", function() {
	ready(this);
});

bot.on("message", message);

bot.on("messageReactionAdd", messageReactionAdded);
