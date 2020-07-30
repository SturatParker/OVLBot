require("dotenv").config();
const { resetItemVotes } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "reset",
	description: "Reset all votes",
	execute: (message, ...args) => {
		if (!message.member.hasPermission("MANAGE_GUILD") && process.env.MODE != "dev") {
			return Promise.resolve();
		}
		embed = new MessageEmbed();
		return resetItemVotes()
			.then(res => {
				embed
					.setColor(color.success)
					.setTitle("Success")
					.setDescription("All votes have been reset");
				return message.channel.send({ embed });
			})
			.catch(err => {
				embed
					.setColor(color.error)
					.setTitle("Oops")
					.setDescription(`Something went wrong:\n\`\`\`${err}\`\`\``);
				return message.channel.send({ embed });
			});
	}
};
