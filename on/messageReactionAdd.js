require("dotenv").config();
const { createVote } = require("../db/db");

module.exports = async (messageReaction, user) => {
	if (messageReaction.message.channel.id != process.env.CHANNEL) {
		return;
	}
	if (messageReaction.emoji.name != "👍") {
		return;
	}
	if (messageReaction.partial) {
		try {
			await messageReaction.fetch();
		} catch (error) {
			console.log("Something went wrong fetching a partial message", error);
			return;
		}
	}
	return createVote({ user: user.id, message: messageReaction.message.id })
		.then(res => {
			return user.send(
				`Thanks for voting for ${messageReaction.message.content}`
			);
		})
		.then(() => {
			return messageReaction.remove();
		})
		.catch(console.log);
};
