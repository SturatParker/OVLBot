const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema({
	channelId: String
});

module.exports = mongoose.model("Monitor", monitorSchema);
