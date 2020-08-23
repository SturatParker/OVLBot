require("dotenv").config();
const { getAllItems } = require("../db/db");
const { color, monitoring } = require("../config");
const { MessageEmbed } = require("discord.js");

const exampleChannel = monitoring.channels[0] || process.env.CHANNEL

module.exports = {
	name: "winners",
	description: "Return the winners of the poll",
	help: `\`winners <#channel> <top>\`\nExamples:\n\`winners <#${exampleChannel}>\`\n\`winners <#${exampleChannel}> 2\``,
	execute: (message, ...args) => {
		if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}

		let channelId = args[0] ? args[0].replace(/<#(.*?)>/, "$1") : undefined;
		if (
			!channelId ||
			typeof channelId != "string" ||
			!message.mentions.channels.has(channelId)
		) {
			return Promise.reject("Missing required argument: #channel");
		}
		if (!monitoring.channels.some(channel => channel == channelId)) {
			return Promise.reject(`<#${channelId}> is not monitored`)
		}
		return getAllItems(channelId).then(items => {
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
			winners = [];
			isTie = false;
			topN = parseInt(args[1]);
			if (!isNaN(topN)) {
				//top args[0] items
				winners = votedItems.slice(0, topN);
			} else {
				//top item or tied top items
				winners = votedItems.filter(
					item => item.voterIds.length == votedItems[0].voterIds.length
				);
				isTie = winners.length > 1;
			}
			const embed = new MessageEmbed()
				.setTitle("Poll winners")
				.setDescription(
					`A total of ${totalVotes} votes were cast this round. ${topN ? "The top items are": `The ${isTie ? "tied winners are" : "winner is"}`}:`
				)
				.setColor(color.success);
			embed.fields = winners.map(item => ({
				name: item.messageContent,
				value: `${item.voterIds.length} votes, submitted by: <@${item.submittedById}>`
			}));
			return message.channel.send({ embed });
		});
	}
};
