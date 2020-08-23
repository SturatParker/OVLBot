const {	getMonitoredChannels, forgetChannel, monitorChannel, updateChannellessItems } = require("./db/db");

var monitoring = {
	channels: [],
	add: channelId =>
		monitorChannel(channelId).then(res => {
			monitoring.channels.push(channelId);
		}),
	remove: channelId =>
		forgetChannel(channelId).then(res => {
			monitoring.channels = monitoring.channels.filter(
				channel => channel != channelId
			);
		})
};
exports.color = {
	success: 1353797,
	error: 16711680
};

exports.monitoring = monitoring;

exports.setup = () => {
	console.log("Loading config values");

	return Promise.all([
		getMonitoredChannels().then(res => {
			console.log(`Monitoring ${res.length} channels`);
			monitoring.channels = res.map(document => document.channelId);
			return;
		}),
		updateChannellessItems(process.env.CHANNEL).then(res => {
			console.log(`Applied default channel id to ${res.nModified} items`);
		})
	]);
};
