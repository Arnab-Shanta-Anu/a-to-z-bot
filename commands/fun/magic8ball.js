const {ApplicationCommandOptionType} = require("discord.js")

const replies = ["It is certain.", "It is decidedly so.", "Without a doubt.",
  "Yes definitely.", "You may rely on it.", "As I see it, yes.",
  "Most likely.", "Outlook good.", "Yes",
  "Signs point to yes.", "Reply hazy, try again.", "Ask again later.",
  "Better not tell you now.", "Cannot predict now.",
  "Concentrate and ask again.", "Don't count on it.", "My reply is no",
  "My sources say no.", "Outlook not so good.", "Very doubtful.",]


module.exports = {
  name: 'magic-8-ball',
  description: 'get a yes/no/maybe answer',
  // devOnly: Boolean,
  testOnly: false,
  options: [{
    name: "query",
    description: "your query",
    type: ApplicationCommandOptionType.String,
    required: true
  }],
  // deleted: Boolean,

  callback: (client, interaction) => {
    var rand = Math.floor(Math.random() * 20);
    interaction.reply(replies[rand]);
  },
};