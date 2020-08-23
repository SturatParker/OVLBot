const { monitoring } = require("../config");
const { createItem } = require("./db");

module.exports = (message, voterIds = []) => {
	if (!monitoring.channels.some(channel => channel == message.channel.id))
		return Promise.resolve();
	msgContent = message.content.replace(/<@!?\d+>/g, ""); //Strip out mentions
	submittedBy = message.mentions.users.first();
	let record = {
		channelId: message.channel.id,
		messageId: message.id,
		submittedById: submittedBy ? submittedBy.id : "",
		messageContent: msgContent,
		voterIds: voterIds
	};
	console.log("Converted message to Item", record);
	return createItem(record);
};
