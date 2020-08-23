const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
	channelId: String,
	messageId: String,
	submittedById: String,
	messageContent: String,
	voterIds: [String]
});

module.exports = mongoose.model("Item", ItemSchema);
