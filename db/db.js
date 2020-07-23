require("dotenv").config();
const mongoose = require("mongoose");
const Vote = require("./model/vote");
const Item = require("./model/item");

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const url = process.env.MONGODB_URL;
const uri = `mongodb+srv://${user}:${password}@${url}`;

const connect = () => {
	return mongoose.connect(uri).then(res => {
		console.log(`Connected to ${url} as ${user}`);
	});
};

const createVote = vote => {
	let record = new Vote(vote);
	return record.save();
};

const getVotes = params => {
	return Vote.find(params);
};

const createItem = item => {
	if (!item.messageId) {
		return Promise.reject(new TypeError("item.messageId is not defined"));
	}
	let record = new Item(item);
	return record.save();
};

const pushVote = (messageId, userid) => {
	return Item.update({ messageId: messageId }, { $push: { voterIds: userid } });
};

const getVotedItems = userid => {
	return Item.find({ voterIds: userid });
};
const getItem = id => {
	return Item.findOne({ messageId: id });
};

exports.connect = connect;
exports.createVote = createVote;
exports.getVotes = getVotes;
exports.createItem = createItem;
exports.getVotedItems = getVotedItems;
exports.getItem = getItem;
exports.pushVote = pushVote;
