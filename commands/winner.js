require("dotenv").config();
const { getVotes } = require("../db/db");
const tallyReducer = (acc, cur) => {
	prev = acc.find(x => {
		return x.message == cur.message;
	});
	if (prev) {
		prev.count++;
	} else {
		acc.push({
			message: cur.message,
			count: 1
		});
	}
	return acc;
};

module.exports = (message, ...args) => {
	// if (!message.member.hasPermission("MANAGE_GUILD")) {
	// 	return Promise.resolve();
	// }
	return getVotes().then(votes => {
		if (!votes.length) {
			return message.channel.send("No votes have been cast");
		}
		let tally = votes.reduce(tallyReducer, []).sort((a, b) => {
			a.count - b.count;
		});
		let max = tally[0];
        return message.guild.channels.cache.get(process.env.CHANNEL).messages.fetch(max.message)
            .then(m => {
			return message.channel.send(
				`\`${m.content}\` won with ${max.count}/${votes.length} votes`
			);
		});
	});
	return Promise.resolve();
};
