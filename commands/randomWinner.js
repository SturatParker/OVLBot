require("dotenv").config();
const { randomItem } = require("../db/db");
const { color, monitoring } = require("../config");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "randomWinner",
	description: "Return a random submission",
	help: "`randomWinner <#channel>`",
	execute: (message, ...args) => {
		if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}
		if (!args[0]) {
			return Promise.reject("Missing required argument: #channel");
		}

		let channelId = args[0] ? args[0].replace(/<#(.*?)>/, "$1") : undefined;
		if (
			!channelId ||
			typeof channelId != "string" ||
			!message.mentions.channels.has(channelId)
		) {
			return Promise.reject("Missing required argument: channel");
        }
        if (!monitoring.channels.some(channel => channel == channelId)) {
			return Promise.reject(`<#${channelId}> is not monitored`)
		}

		return randomItem(channelId).then(res => {
			if (!res.count) {
				Promise.reject(
					"I couldn't find any submissions in this channel. The database may have not been populated"
				);
			}
			const embed = new MessageEmbed()
				.setColor(color.success)
				.setTitle("Random winner")
				.setDescription(`Selected from ${res.count} submissions`)
				.addField(
					res.item.messageContent,
					`Submitted by <@${res.item.submittedById}>`
				);
			return message.channel.send({ embed });
		});
	}
};
