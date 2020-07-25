require("dotenv").config();
const {
	createItem,
	getVotedItems,
	getItem,
	pushVote
} = require("../db/db");

const acknowledgeVote = (user, voteMessage) => {
	return user.send(`Thanks for voting for ***${voteMessage}***`);
};

const rejectVote = (user, voteMessage, reason) => {
	return user.send(
		`Sorry, we couldn't register your vote for ***${voteMessage}*** because ${reason ||
			"unspecified reason"}`
	);
};

const completePartial = message => {
	if (message.partial) {
		return message.fetch();
	} else {
		return Promise.resolve(message);
	}
};

const processMessageReaction = (messageReaction, user, items) => {
	voteLim = process.env.VOTE_LIMIT;
	ownLim = process.env.OWN_VOTE_LIMIT;
	msgId = messageReaction.message.id;
	msgContent = messageReaction.message.content.replace(/<@\d+>/); //Strip out mentions
	submittedBy = messageReaction.message.mentions.users.first();
	if (items.length >= process.env.VOTE_LIMIT) {
		return rejectVote(
			user,
			msgContent,
			`you have cast the maximum number of votes (${voteLim})`
		);
	}
	selfVotes = items.find(item => {
		item.submittedById == user.id;
	});
	if (selfVotes && selfVotes.length >= ownLim) {
		return rejectVote(
			user,
			msgContent,
			`you have already voted for you own submissions the maximum number of times (${ownLim})`
		);
	}
	let isDupe = items.some(item => {
		return item.messageId == msgId;
	})
	if (isDupe) {
		return rejectVote(user, msgContent, "you have already voted for it");
	}
	return getItem(msgId).then(item => {
		if (item) {
			return pushVote(user.id).then(() => {
				return acknowledgeVote(user, msgContent);
			});
		}
		return createItem({
			messageId: messageReaction.message.id,
			submittedById: submittedBy ? submittedBy.id : "",
			messageContent: msgContent,
			voterIds: [user.id]
		}).then(() => {
			acknowledgeVote(user, msgContent);
		});
	});
};

module.exports = (messageReaction, user) => {
	if (messageReaction.message.channel.id != process.env.CHANNEL) {
		return Promise.resolve();
	}
	if (messageReaction.emoji.name != "👍") {
		return Promise.resolve();
	}
	//return Promise.resolve();
	return completePartial(messageReaction)
		.then(() => {
			return getVotedItems(user.id);
		})
		.then(items => {
			processMessageReaction(messageReaction, user, items);
		})
		.then(messageReaction.remove());
};
