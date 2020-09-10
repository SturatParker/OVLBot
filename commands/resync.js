require("dotenv").config();
const { getAllItems } = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "resync",
	description: "Resynchronise the database with Discord message submissions",
	execute: (message, ...args) => {
		if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}

		const resyncItem = item => {

			let channel = message.guild.channels.cache.get(item.channelId || process.env.CHANNEL)
			 	
			return channel.messages.fetch(item.messageId)
			.then(message => {
					msgContent = message.content.replace(/<@!?\d+>/g, ""); //Strip out mentions
					submittedBy = message.mentions.users.first();
					if (msgContent == item.messageContent && submittedBy == item.submittedById) {
							return Promise.resolve()
						} else {
								item.messageContent = msgContent;
								item.submittedById = submittedBy;
								return item.save()
							}
						})
		}

		const resync = items => {
			const promiseArray = items.map(resyncItem)
			return Promise.all(promiseArray)
		}
		
		return getAllItems().then(resync).then(res=> {
			embed = new MessageEmbed()
			.setColor(color.success)
			.setTitle("Resync")
			.setDescription("Resync complete");
			return message.channel.send({embed})
		});
	}
};
