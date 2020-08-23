require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./model/item");
const Monitor = require("./model/monitor");

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const url = process.env.MONGODB_URL;
const uri = `mongodb+srv://${user}:${password}@${url}`;

const connect = () => {
	return mongoose.connect(uri).then(res => {
		console.log(`Connected to ${url} as ${user}`);
	});
};

const createItem = item => {
	if (!item.messageId) {
		return Promise.reject(new TypeError("item.messageId is not defined"));
	}
	let record = new Item(item);
	return record.save();
};

const pushVote = (messageId, userid) => {
	return Item.findOneAndUpdate(
		{ messageId: messageId },
		{ $push: { voterIds: userid } }
	);
};

const getVotedItems = userid => {
	return Item.find({ voterIds: userid });
};
const getItem = id => {
	return Item.findOne({ messageId: id });
};
const getAllItems = channelId => {
	let query = channelId ? { channelId: channelId } : {};
	return Item.find(query);
};

const resetItemVotes = () => {
	let update = {
		$set: {
			voterIds: []
		}
	};
	return Item.updateMany({}, update);
};

const deleteItem = id => {
	return Item.findOneAndRemove({ messageId: id });
};

const itemsByVoterId = voterId => {
	return Item.find({ voterIds: voterId });
};

const monitorChannel = id => {
	if (!id || typeof id != "string")
		return Promise.reject(new TypeError("channelId must be a string"));
	let record = new Monitor({ channelId: id });
	return record.save();
};

const forgetChannel = channelId => {
	return Monitor.findOneAndDelete({ channelId: channelId });
};

const getMonitoredChannels = () => {
	return Monitor.find();
};

const randomItem = channelId => {
	let query = channelId ? { channelId: channelId } : {};
	return Item.count(query).then(count => {
		let rand = Math.floor(Math.random() * count);
		return Item.findOne(query)
			.skip(rand)
			.then(item => ({ item, count }));
	});
};

const updateChannellessItems = id => {
	let query = {
		$or: [{ channelId: { $exists: false } }, { channelId: null }]
	};
	let update = {
		$set: {
			channelId: id
		}
	};
	return Item.updateMany(query, update);
};


exports.connect = connect;
exports.createItem = createItem;
exports.getVotedItems = getVotedItems;
exports.getItem = getItem;
exports.pushVote = pushVote;
exports.getAllItems = getAllItems;
exports.resetItemVotes = resetItemVotes;
exports.deleteItem = deleteItem;
exports.itemsByVoterId = itemsByVoterId;
exports.monitorChannel = monitorChannel;
exports.forgetChannel = forgetChannel;
exports.getMonitoredChannels = getMonitoredChannels;
exports.randomItem = randomItem;
exports.updateChannellessItems = updateChannellessItems;
