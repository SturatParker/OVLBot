require("dotenv").config();
const { resetItemVotes } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");
const fs = require("fs");
const { Collection } = require("discord.js");

const commandsFiles = fs
	.readdirSync("./commands")
	.filter(file => file.endsWith(".js") && file !== "help.js");
const commandArrays = commandsFiles.map(file => {
	const cmd = require(`../commands/${file}`);
	return [cmd.name, cmd];
})
const commands = new Collection(commandArrays);

module.exports = {
	name: "help",
	description: `Type \`${process.env.PREFIX}help <command>\` for further details`,
	execute: function(message, ...args) {
		// if (
		// 	(!message.member || !message.member.hasPermission("MANAGE_GUILD")) &&
		// 	process.env.MODE != "dev"
		// ) {
		// 	return Promise.resolve();
		// }
		const commandArg = args[0] ? args[0].toLowerCase() : "";
		if (!commandArg) {
			embed = new MessageEmbed()
				.setColor(color.success)
				.setTitle("Commands")
				.setDescription(this.description);
			embed.fields = commands.map(command => ({
				name: command.name,
				value: command.description
			}));
			return message.channel.send({ embed });
		} else {
            if (!commands.has(commandArg)) return Promise.resolve();
            command = commands.get(commandArg)
			embed = new MessageEmbed()
				.setColor(color.success)
				.setTitle(command.name)
				.setDescription(
					`${command.description}${command.help ? `\n${command.help}` : ""}`
				);
			return message.channel.send({ embed });
		}
	}
};
