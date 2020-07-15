module.exports = (client) => {
    const general = client.channels.find(channel => channel.name === "general")
    general.send("I am alive")
    console.log('ready')
}