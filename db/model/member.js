const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    id: String,
    cancelVoteCounter: Number
});

module.exports = mongoose.model("Member", MemberSchema);
