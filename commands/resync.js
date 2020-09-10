require("dotenv").config();
const { getAllItems } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "reset",
	description: "Resynchronise the database with Discord message submissions",
	execute: (message, ...args) => {
		if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}
		embed = new MessageEmbed();
		let channel = message.guild.channels.cache.get(process.env.CHANNEL)
		return getAllItems().then(items => {
			items.forEach(item=> {
				channel.messages.fetch(item.messageId).then(
					
				)
			})
		});
	}
};
