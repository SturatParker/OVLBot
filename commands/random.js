require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "random",
	description: "Get a random number",
	help: "\`random <max>\`\n\`random <min> <max>\`",
	execute: (message, ...args) => {
		embed = new MessageEmbed();

		if (args.length == 0) return Promise.reject("Missing parameters");
		if (args.length > 2) return Promise.reject("Too many parameters");
		let min = 1, max;
		if (args.length == 1) {
			max = parseInt(args[0])
			if (isNaN(max)) return Promise.reject("Parameters must be integers")
		} else if(args.length == 2) {
			min = parseInt(args[0])
			max = parseInt(args[1])
			if (isNaN(min) || isNaN(max)) return Promise.reject("Parameters must be integers")
		}

		let rand = Math.floor(min + Math.random() * (max - min + 1))
		embed
			.setColor(color.success)
			.setTitle("Random")
			.setDescription(rand);
		return message.channel.send({ embed });
	}
};
