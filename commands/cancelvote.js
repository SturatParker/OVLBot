require("dotenv").config();
const { itemsByVoterId, pullVote } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "cancelvote",
	description: "Cancel a vote",
	execute: (message, ...args) => {
		embed = new MessageEmbed();
		return itemsByVoterId(message.author.id).then(res => {
			embed
				.setColor(color.success)
				.setTitle("Cancel Vote")
				.setDescription(
					`Which vote should be cancelled? Reply with the number.`
				);
			embed.fields = res.map((item, index) => ({
				name: `\`${index + 1})\` ${item.messageContent}`,
				value: `Submitted by: <@${item.submittedById}>`
			}));
			return message.author.send({ embed }).then(optionMessage => {
				const filter = m =>
					m.author.id === message.author.id &&
					!isNaN(parseInt(m.content)) &&
					parseInt(m.content) > 0 &&
					parseInt(m.content) <= res.length;
				const collector = optionMessage.channel.createMessageCollector(filter, {
					time: 15000
				});
				collector.on("collect", m => {
					index = parseInt(m.content) - 1;
					item = res[index];

					console.log(`Collected ${m.content}, to delete item ${item}`);
					pullVote(item.messageId, m.author.id)
						.then(() => {
							embed.fields[index] = {
								name: `~~${embed.fields[index].name}~~`,
								value: `~~${embed.fields[index].value}~~`
							};
							return Promise.all([m.react("✅"), optionMessage.edit(embed)]);
						})
						.catch(() => m.react("❌"));
					collector.stop();
				});
			});
		});
	}
};
