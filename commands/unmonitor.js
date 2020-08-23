require("dotenv").config();
const { monitorChannel } = require("../db/db");
const { color, monitoring } = require("../config");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "unmonitor",
	description: "Stop monitoring a channel",
	help: "`unmonitor <@channel>`",
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

		if (!monitoring.channels.some(channel => channel == channelId)) {
			return Promise.reject(`${channelId} is not monitored`);
		}

        return monitoring.remove(channelId).then(res => {
			const embed = new MessageEmbed()
				.setTitle("Unmonitor")
				.setDescription(`Channel successfully removed from monitor list... kinda`)
				.setColor(color.success);
			return message.channel.send({ embed });
		});
	}
};
