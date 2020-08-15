require("dotenv").config();
const { itemsByVoterId } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");
const voteLim = process.env.VOTE_LIMIT

module.exports = {
	name: "myvotes",
	description: "Who have I voted for?",
	execute: (message, ...args) => {
		embed = new MessageEmbed();
		return itemsByVoterId(message.author.id)
			.then(res => {
				embed
					.setColor(color.success)
					.setTitle("Your votes")
                    .setDescription(`You have cast ${res.length} votes, and have ${voteLim - res.length} vote remaining`);
                embed.fields = res.map(item=> ({
                    name: item.messageContent,
                    value: `Submitted by: <@${item.submittedById}>`
                }))
				return message.channel.send({ embed });
			})
	}
};
