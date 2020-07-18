require('dotenv').config()
const mongoose = require('mongoose')
const Vote = require('./model/vote')

const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const url = process.env.MONGODB_URL
const uri = `mongodb+srv://${user}:${password}@${url}`

const connect = () => {
    return mongoose.connect(uri)
    .then((res)=>{
        console.log(`Connected to ${url} as ${user}`)
    })
}

const createVote = (vote) => {
    let record = new Vote(vote)
    return record.save()
}

const getVotes = ( params ) => {
    return Vote.find(params)
}

exports.connect = connect
exports.createVote = createVote
exports.getVotes =  getVotes