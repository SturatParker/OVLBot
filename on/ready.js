require("dotenv").config();

module.exports = client => {
	console.log(`Logged in as ${client.user.tag}`);
	if (process.env.MODE == "dev") return;
	client.channels
		.fetch(process.env.LOG)
		.then(channel => {
			return channel.send("Ready");
		})
		.catch(console.error);
};
