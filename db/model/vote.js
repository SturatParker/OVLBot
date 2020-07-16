const mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
    user: String,
    message: String
})

module.exports = mongoose.model('Vote', VoteSchema)