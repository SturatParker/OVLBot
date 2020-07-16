require("dotenv").config();

module.exports = async (messageReaction, user) => {
	console.log("messageReactionAdded");
	if (messageReaction.partial) {
		try {
			await messageReaction.fetch();
		} catch (error) {
			console.log("Something went wrong fetching a partial message", error);
			return;
		}
	}

	if (messageReaction.emoji.name != "👍")
		return;
	messageReaction.message.channel.send(
		"Thanks for your vote! I won't remember it because I don't have a database yet!"
	);
};
