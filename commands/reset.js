require("dotenv").config();
const { resetItemVotes, dropItems, memberResetCancelVotes } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "reset",
	description: "Reset all votes",
	help: "\`reset\`\n\`reset -full\`",
	execute: (message, ...args) => {
		if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}
		embed = new MessageEmbed();

		const itemAction = args.includes("-full") ? dropItems : resetItemVotes

		return Promise.all([itemAction(), memberResetCancelVotes()])
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
