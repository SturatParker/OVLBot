require("dotenv").config();
const { getVotedItems, getItem, pushVote } = require("../db/db");
const { messageToItem } = require("../db/messageToItem");
const { MessageEmbed } = require("discord.js");
const { color, monitoring } = require("../config");

const acknowledgeVote = (user, voteMessage) => {
	const embed = new MessageEmbed()
		.setTitle("Success")
		.setDescription(`Thanks for voting for ***${voteMessage}***`)
		.setColor(color.success);
	return user.send({ embed });
};

const rejectVote = (user, voteMessage, reason) => {
	const embed = new MessageEmbed()
		.setTitle("Vote failed")
		.setDescription(
			`We couldn't register your vote for ***${voteMessage}*** because ${reason ||
				"unspecified reason"}`
		)
		.setColor(color.error);
	return user.send({ embed });
};

const completePartial = message => {
	if (message.partial) {
		return message.fetch();
	} else {
		return Promise.resolve(message);
	}
};

const processMessageReaction = (messageReaction, user, items) => {
	voteLim = Number(process.env.VOTE_LIMIT);
	ownLim = Number(process.env.OWN_VOTE_LIMIT);
	msgId = messageReaction.message.id;
	msgContent = messageReaction.message.content.replace(/<@!?\d+>/g, ""); //Strip out mentions
	submittedBy = messageReaction.message.mentions.users.first();
	if (items.length >= process.env.VOTE_LIMIT) {
		return rejectVote(
			user,
			msgContent,
			`you have cast the maximum number of votes (${voteLim})`
		);
	}
	let isDupe = items.some(item => {
		return item.messageId == msgId;
	});
	if (isDupe) {
		return rejectVote(user, msgContent, "you have already voted for it");
	}
	if (submittedBy.id == user.id) {
		let selfVotes = [...items.filter(item => item.submittedById == user.id)];
		if (selfVotes.length >= ownLim) {
			return rejectVote(
				user,
				msgContent,
				`you have already voted for your own submissions the maximum number of times (${ownLim})`
			);
		}
	}
	return getItem(msgId).then(item => {
		if (item) {
			return pushVote(msgId, user.id).then(res => {
				return acknowledgeVote(user, msgContent);
			});
		}
		return messageToItem(message, [user.id]).then(() => {
			acknowledgeVote(user, msgContent);
		});
	});
};

module.exports = (messageReaction, user) => {
	if (messageReaction.emoji.name != "👍") {
		return Promise.resolve();
	}
	if (
		!monitoring.channels.some(
			channel => channel == messageReaction.message.channel.id
		)
	) {
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
