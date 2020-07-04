require('dotenv').config();
const Discord = require('discord.js');
const onMessage = require('./on/message')
const onReady = require('./on/ready')
const bot = new Discord.Client();
const prefix = process.env.PREFIX

bot.login(process.env.DISCORD_TOKEN)
    .catch(console.log)

bot.on('ready', onReady)

bot.on('message', onMessage)