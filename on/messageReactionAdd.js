require("dotenv").config();
const { getVotes, createVote } = require("../db/db");

const acknowledgeVote = (user, voteMessage) => {
	return user.send(`Thanks for voting for ***${voteMessage}***`);
};

const rejectVote = (user, voteMessage, reason) => {
	return user.send(
		`Sorry, we couldn't register your vote for ***${voteMessage}*** because ${reason ||
			"unspecified reason"}`
	);
};

const processRequest = (votes, user, messageReaction) => {
	const voteLim = process.env.VOTE_LIMIT;
	const alreadyVoted = votes.some(
		vote => vote.message == messageReaction.message.id
	);
	const voteText = messageReaction.message.content;
	if (alreadyVoted) {
		return rejectVote(user, voteText, "you have already voted for it");
	}
	if (votes.length >= voteLim) {
		return rejectVote(
			user,
			voteText,
			`you have cast the maximum number of votes (${voteLim})`
		);
	}
	return createVote({
		user: user.id,
		message: messageReaction.message.id
	}).then(acknowledgeVote(user, messageReaction.message.content));
};

const completePartial = message => {
	if (message.partial) {
		return message.fetch();
	} else {
		return Promise.resolve(message);
	}
};

module.exports = (messageReaction, user) => {
	if (messageReaction.message.channel.id != process.env.CHANNEL) {
		return Promise.resolve();
	}
	if (messageReaction.emoji.name != "👍") {
		return Promise.resolve();
	}

	completePartial(messageReaction)
		.then(() => {
			return getVotes({ user: user.id });
		})
		.then(votes => {
			return processRequest(votes, user, messageReaction);
		})
		.then(() => {
			return messageReaction.remove();
		})
		.catch(console.log);
};
