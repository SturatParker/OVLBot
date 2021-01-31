require("dotenv").config();
const {
	itemsByVoterId,
} = require("../db/db");
const { MessageEmbed } = require("discord.js");
const { color } = require("../config");

module.exports = {
	name: "comparevoters",
    description: "Compare two voters and list submissions voted for by both voters",
    help: `\`compareVoters @voter1 @voter2\``,
	execute: (message, ...args) => {
        console.log(message)
        if (
			!message.member.hasPermission("MANAGE_GUILD") &&
			process.env.MODE != "dev"
		) {
			return Promise.resolve();
		}
        if (message.mentions.members.size != 2) {
            return Promise.reject('Invalid syntax: Two voters must be \`@mentioned\`')
        }

        return Promise.all([
            itemsByVoterId(message.mentions.members.first().id),
            itemsByVoterId(message.mentions.members.last().id)
        ]).then(res=>{
            let [first, last] = res;
            let commonItems = first.filter(itemF => 
                last.some(itemL => 
                    itemL.messageId == itemF.messageId
                )
            )
            return {first: first, last: last, common: commonItems}
        }).then(items=>{
            firstCount = items.first?.length || 0;
            lastCount = items.last.length || 0;
            commonCount = items.common?.length || 0;
            embed = new MessageEmbed();
            embed.setColor(color.success)
            .setTitle("Compare voters")
            .setDescription(
                `Total votes cast:
                <@${message.mentions.members.first().id}>: **${firstCount}**
                <@${message.mentions.members.last().id}>: **${lastCount}**
                Votes in common: **${commonCount}/${firstCount+lastCount-commonCount}**`
            )

            if (commonCount) {
                embed.fields = items.common.map(item => ({
                    name: item.messageContent,
                    value: `${item.url ? `[🔗](${item.url}) ` : ""}${item.voterIds.length} votes, submitted by: <@${item.submittedById}>`
                }));
            }
            return message.channel.send({embed})

        })

	},
};
