require("dotenv").config();
const { log } = require("../log");
const { createItem, getVotedItems, getItem, pushVote } = require("../db/db");
const { getSuspiciousPeers } = require("../common/getSuspiciousPeers");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

const acknowledgeVote = (user, voteMessage) => {
	log(`Vote accepted`);
	const embed = new MessageEmbed()
		.setTitle("Success")
		.setDescription(`Thanks for voting for ***${voteMessage}***`)
		.setColor(color.success);
	return user.send({ embed });
};

const rejectVote = (user, voteMessage, reason) => {
	log(`Reaction rejected: ${reason}`);
	const embed = new MessageEmbed()
		.setTitle("Vote failed")
		.setDescription(
			`We couldn't register your vote for ***${voteMessage}*** because ${
				reason || "unspecified reason"
			}`
		)
		.setColor(color.error);
	return user.send({ embed });
};

const completePartial = (message) => {
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
	let isDupe = items.some((item) => {
		return item.messageId == msgId;
	});
	if (isDupe) {
		return rejectVote(user, msgContent, "you have already voted for it");
	}
	if (submittedBy?.id == user.id) {
		let selfVotes = [...items.filter((item) => item.submittedById == user.id)];
		if (selfVotes.length >= ownLim) {
			return rejectVote(
				user,
				msgContent,
				`you have already voted for your own submissions the maximum number of times (${ownLim})`
			);
		}
	}
	return getItem(msgId)
		.then((item) => {
			if (item) {
				return pushVote(msgId, user.id).then((res) => {
					return acknowledgeVote(user, msgContent);
				});
			}
			return createItem({
				messageId: messageReaction.message.id,
				channelId: messageReaction.message.channel.id,
				url: messageReaction.message.url,
				submittedById: submittedBy ? submittedBy.id : "",
				messageContent: msgContent,
				voterIds: [user.id],
			}).then(() => {
				acknowledgeVote(user, msgContent);
			});
		})
		.then(() => {
			return getSuspiciousPeers(user.id).then((peerIds) => {
				if (!peerIds.length) return;
				const suspiciousActivityMessage = new MessageEmbed()
					.setTitle("Suspicious activity")
					.setColor(color.error)
					.setDescription(
						`<@${
							user.id
						}>'s voting behaviour this round has been found to be suspiciously similar to the following member(s):\n${peerIds.map(id=>`<@${id}>`).join(
							"\n"
						)}`
					);
				logChannel = messageReaction.message.guild.channels.cache.get(process.env.LOG);
				logChannel.send(suspiciousActivityMessage);
			});
		});
};

module.exports = (messageReaction, user) => {
	log(
		`Reaction: ${messageReaction.emoji.name}, Message: ${messageReaction.message.url}, Reactor: ${user.username}`
	);
	if (messageReaction.message.channel.id != process.env.CHANNEL) {
		return Promise.resolve();
	}

	const voteEmoji = ["👍", "👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿"];
	if (!voteEmoji.includes(messageReaction.emoji.name)) {
		return Promise.resolve();
	}
	log(`Processing reaction...`);
	return completePartial(messageReaction)
		.then(() => {
			return getVotedItems(user.id);
		})
		.then((items) => {
			return Promise.all([
				processMessageReaction(messageReaction, user, items),
				messageReaction.remove(),
			]);
		})
		.catch(console.error);
};
