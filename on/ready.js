require('dotenv').config();

module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    client.channels.fetch(process.env.LOG)
    .then(channel => {
        return channel.send("Ready")
    })
    .catch(console.error)
}