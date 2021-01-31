require("dotenv").config();
const { itemsByVoterId } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");
const voteLim = process.env.VOTE_LIMIT;

module.exports = {
	name: "votes",
	description: "Who have I voted for?",
	help: `\`votes\`\n\`votes @mention\``,
	execute: (message, ...args) => {
		queryId = message.mentions.members.first()?.id || message.author.id;
		if (
			queryId == message.author.id &&
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.reject("You do not have permission to view another member's votes.");
		}
		displayName = message.guild.members.cache.get(queryId).displayName
		isPublic = args.includes('--public');
		replyChannel = isPublic ? message.channel : message.author;
		embed = new MessageEmbed();
		return itemsByVoterId(queryId).then(res => {
			embed
				.setColor(color.success)
				.setTitle(`${displayName}'s votes`)
				.setDescription(
					`This member has cast ${res.length} votes, and has ${voteLim -
						res.length} vote remaining`
				);
			embed.fields = res.map(item => ({
				name: item.messageContent,
				value: `Submitted by: <@${item.submittedById}>`
			}));
			return replyChannel.send({ embed });
		});
	}
};
