require("dotenv").config();
const mongoose = require("mongoose");
const { create } = require("./model/item");
const Item = require("./model/item");
const member = require("./model/member");
const Member = require("./model/member");

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const url = process.env.MONGODB_URL;
const uri = `mongodb+srv://${user}:${password}@${url}`;

mongoose.set("useFindAndModify", false);

const connect = () => {
	return mongoose.connect(uri).then((res) => {
		console.log(`Connected to ${url} as ${user}`);
	});
};

const createItem = (item) => {
	if (!item.messageId) {
		return Promise.reject(new TypeError("item.messageId is not defined"));
	}
	let record = new Item(item);
	return record.save();
};

const pushVote = (messageId, userId) => {
	return Item.findOneAndUpdate(
		{ messageId: messageId },
		{ $push: { voterIds: userId } }
	);
};

const pullVote = (messageId, userId) => {
	return Item.findOneAndUpdate(
		{ messageId: messageId },
		{ $pull: { voterIds: userId } }
	);
};

const getVotedItems = (userid) => {
	return Item.find({ voterIds: userid });
};
const getItem = (id) => {
	return Item.findOne({ messageId: id });
};
const getAllItems = () => {
	return Item.find();
};

const resetItemVotes = () => {
	let update = {
		$set: {
			voterIds: [],
		},
	};
	return Item.updateMany({}, update);
};

const deleteItem = (id) => {
	return Item.findOneAndRemove({ messageId: id });
};

const dropItems = () => {
	return Item.deleteMany({});
};

const itemsByVoterId = (voterId) => {
	return Item.find({ voterIds: voterId });
};

const createMember = (member) => {
	if (!member.id) {
		return Promise.reject(new TypeError("member.id is not defined"));
	}
	let record = new Member(member);
	return record.save();
};

const memberResetCancelVotes = (id) => {
	const update = {
		cancelVoteCounter: 0,
	};
	if (id == undefined) {
		return Member.updateMany({}, update);
	}
	const filter = {
		id: id,
	};
	return Member.findOneAndUpdate(filter, update);
};

const memberCancelVote = (id) => {
	const filter = {
		id: id,
	};
	const update = {
		$inc: {
			cancelVoteCounter: 1,
		},
	};
	return Member.findOneAndUpdate(filter, update).then((res) =>
		res == null ? createMember({ ...filter, cancelVoteCounter: 1 }) : res
	);
};

const getMember = (id) => {
	const filter = {
		id: id,
	};
	return Member.findOne(filter);
};

const getMemberCancelVotes = (id) => {
	const filter = {
		id: id,
	};
	const projection = {
		cancelVoteCounter: 1,
	};
	return Member.findOne(filter, projection).then(
		(res) => res?.cancelVoteCounter ?? 0
	);
};

const deleteMember = (id) =>
	Promise.all([
		Item.updateMany({voterIds: id},{ $pull: { voterIds: id } }),
		Member.findOneAndDelete({ id: id }),
	]);

exports.connect = connect;
exports.createItem = createItem;
exports.getVotedItems = getVotedItems;
exports.getItem = getItem;
exports.dropItems = dropItems;
exports.pushVote = pushVote;
exports.pullVote = pullVote;
exports.getAllItems = getAllItems;
exports.resetItemVotes = resetItemVotes;
exports.deleteItem = deleteItem;
exports.itemsByVoterId = itemsByVoterId;
exports.getMember = getMember;
exports.getMemberCancelVotes = getMemberCancelVotes;
exports.memberResetCancelVotes = memberResetCancelVotes;
exports.createMember = createMember;
exports.memberCancelVote = memberCancelVote;
exports.deleteMember = deleteMember
