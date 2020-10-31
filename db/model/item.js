const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
	messageId: String,
	channelId: String,
	url: String,
	submittedById: String,
	messageContent: String,
	voterIds: [String]
});

module.exports = mongoose.model("Item", ItemSchema);
