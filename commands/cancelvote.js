require("dotenv").config();
const {
	itemsByVoterId,
	pullVote,
	getMemberCancelVotes,
	memberCancelVote,
	createMember
} = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");
const CANCEL_LIMIT = process.env.CANCEL_LIMIT;
const isPrivate = !process.env.MODE == "dev";

const cancelLimitExceeded = send => {
	embed = new MessageEmbed();
	embed
		.setColor(color.success)
		.setTitle("Cancel Vote")
		.setDescription(
			`Sorry, but you've already cancelled a vote the maximum number of times allowed in this round.`
		);
	return send({ embed });
};

const noItems = send => {
	embed = new MessageEmbed();
	embed
		.setColor(color.success)
		.setTitle("Cancel Vote")
		.setDescription(`You have not cast any votes in this round yet!`);
	return send({ embed });
};

module.exports = {
	name: "cancelvote",
	description: "Cancel a vote",
	execute: (message, ...args) => {
		const send = (...args) =>
			isPrivate ? message.author.send(...args) : message.channel.send(...args);
		embed = new MessageEmbed();
		return Promise.all([
			itemsByVoterId(message.author.id),
			getMemberCancelVotes(message.author.id)
		]).then(values => {
			let [items, cancelCount] = values;
			if (items.length == 0) {
				return noItems(send);
			}
			if (cancelCount >= CANCEL_LIMIT) {
				return cancelLimitExceeded(send);
			}
			embed
				.setColor(color.success)
				.setTitle("Cancel Vote")
				.setDescription(
					`Which vote should be cancelled? Reply with the number.\nYou may cancel your vote ${CANCEL_LIMIT -
						cancelCount} more times this round.`
				);
			embed.fields = items.map((item, index) => ({
				name: `\`${index + 1})\` ${item.messageContent}`,
				value: `Submitted by: <@${item.submittedById}>`
			}));
			return send({ embed }).then(optionMessage => {
				const filter = m =>
					m.author.id === message.author.id &&
					!isNaN(parseInt(m.content)) &&
					parseInt(m.content) > 0 &&
					parseInt(m.content) <= items.length;
				const collector = optionMessage.channel.createMessageCollector(filter, {
					time: 15000
				});
				collector.on("collect", m => {
					index = parseInt(m.content) - 1;
					item = items[index];

					console.log(`Collected ${m.content}, to delete item ${item}`);
					pullVote(item.messageId, m.author.id)
						.then(() => memberCancelVote(message.author.id))
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
