require("dotenv").config();
const { color } = require("../config");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "joinedat",
	description: "joinedat",
	help: "`joinedat`\n`",
	execute: (message, ...args) => {
		if (args[0] == "-all") {
			return message.guild.members.fetch().then((members) => {
				const embed = new MessageEmbed()
					.setTitle("Joined At")
					.setDescription(
						members
							.sort((A, B) => A.joinedAt - B.joinedAt)
							.map((member) => `${member.displayName} at ${member.joinedAt}`)
							.join(`/n`)
					)
					.setColor(color.success);
				return message.channel.send({ embed });
			});
		}
		if (args[0]) {
			return message.guild.members
				.fetch({ query: args[0], limit: 1 })
				.then((members) => {
					if (members.first() == undefined) {
						return Promise.reject("Unable to find a member with that name");
					}
					let member = members.first();
					const embed = new MessageEmbed()
						.setTitle("Joined At")
						.setDescription(`${member.displayName} joined ${member.joinedAt}`)
						.setColor(color.success);
					return message.channel.send({ embed });
				});
		}
		const embed = new MessageEmbed()
			.setTitle("Joined At")
			.setDescription(`You joined ${message.member.joinedAt}`)
			.setColor(color.success);
		return message.channel.send({ embed });
	},
};
