require("dotenv").config();
const { monitorChannel } = require("../db/db");
const { color, monitoring } = require("../config");
const { MessageEmbed } = require("discord.js");

const scrapeChannel = (channel, messages) => {
    channel.messages.fetch({limit:100}).then(messages)
}

module.exports = {
	name: "monitor",
	description: "Begin monitoring a channel",
	help: "`monitor <@channel>`",
	execute: (message, ...args) => {
		if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}
		let channelId = args[0].replace(/<#(.*?)>/, "$1");
		if (
			!channelId ||
			typeof channelId != "string" ||
			!message.mentions.channels.has(channelId)
		) {
			return Promise.reject("Missing required argument: #channel");
		}

		if (monitoring.channels.some(channel => channel == channelId)) {
			return Promise.reject("This channel is already monitored");
		}

		return monitoring.add(channelId).then(res => {
			const embed = new MessageEmbed()
				.setTitle("Monitor")
				.setDescription(`Channel successfully added to monitor list... kinda`)
				.setColor(color.success);
			return message.channel.send({ embed });
		});
	}
};
