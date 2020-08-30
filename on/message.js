require("dotenv").config();
const prefix = process.env.PREFIX;
const fs = require("fs");
const { Collection, MessageEmbed } = require("discord.js");
const commandsFiles = fs
	.readdirSync("./commands")
	.filter(file => file.endsWith(".js"));
const commands = new Collection(
	commandsFiles.map(file => {
		const cmd = require(`../commands/${file}`);
		return [cmd.name, cmd];
	})
);
const { color } = require("../config");

module.exports = message => {
	if (process.env.MODE == "dev") {
		console.log(message.content);
	}
	// Ignore bot users
	if (message.author.bot) {
		return;
	}
	// Ignore incorrect prefix
	if (!message.content.startsWith(prefix)) {
		return;
	}
	message.content = message.content.slice(prefix.length);
	args = message.content.trim().match(/(?:[^\s"]+|"[^"]*")+/g);
	// Ignore no command
	if (!args.length) {
		return;
	}
	command = args[0].toLowerCase();
	args.shift();

	if (!commands.has(command)) return Promise.resolve();

	return commands
		.get(command)
		.execute(message, ...args)
		.catch(err => {
			console.log(err.stack);
			embed = new MessageEmbed()
				.setTitle("Oops")
				.setDescription(`${err}\nTry \`help\` for more info`)
				.setColor(color.error);
			return message.channel.send({ embed });
		});
};
