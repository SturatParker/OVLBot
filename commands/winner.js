require("dotenv").config();
const { getAllItems } = require("../db/db");

module.exports = (message, ...args) => {
	if (!message.member.hasPermission("MANAGE_GUILD")) {
		return Promise.resolve();
	}
	return getAllItems().then(items => {
		votedItems = items
			.filter(item => item.voterIds.length)
			.sort((a, b) => {
				return b.voterIds.length - a.voterIds.length;
			});
		if (!votedItems.length) {
			return message.channel.send("No votes found");
		}
		totalVotes = votedItems.reduce((acc, cur) => {
			return acc + cur.voterIds.length;
		}, 0);
		winners = votedItems.filter(
			item => item.voterIds.length == votedItems[0].voterIds.length
		);
		isTie = winners.length > 1;
		const embed = {
			title: "Poll winners",
			description: `A total of ${totalVotes} votes were cast this round. With ${
				winners[0].voterIds.length
			} votes the ${isTie ? "tied winners are" : "winner is"}:`,
			color: 1353797,
			fields: winners.map(item => ({
				name: item.messageContent,
				value: `Submitted by: <@${item.submittedById}>`
			}))
		};
		return message.channel.send({embed});
	});
};