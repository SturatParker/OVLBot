require("dotenv").config();

module.exports = async (messageReaction, user) => {
	if (messageReaction.partial) {
		try {
			await messageReaction.fetch();
		} catch (error) {
			console.log("Something went wrong fetching a partial message", error);
			return;
		}
	}

	if (messageReaction.emoji.name == "👍") {
		return user
			.send(
				"Thanks for your vote! I won't remember it because I don't have a database yet!"
			)
			.then(() => {
				return messageReaction.remove();
			});
	}
};
