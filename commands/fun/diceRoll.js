const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
  name: 'dice-roll',
  description: 'generates a random dice roll for d6,d8,d12,d16,d20',
  // devOnly: Boolean,
  testOnly: false,

  options: [{
    name: "option1",
    description: "select a dice d6/d8/d16/d20",
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: [
      { name: 'D6', value: 'd6' },
      { name: 'D8', value: 'd8' },
      { name: 'D12', value: 'd12' },
      { name: 'D16', value: 'd16' },
      { name: 'D20', value: 'd20' },
    ]
  }],

  callback: (client, interaction) => {
    let options = [];
    options.push(interaction.options.get("option1"));

    let rand = Math.floor(Math.random() * 20) + 1

    switch (options[0].value) {
      case "d6": rand = Math.floor(Math.random() * 6) + 1; break;
      case "d8": rand = Math.floor(Math.random() * 8) + 1; break;
      case "d12": rand = Math.floor(Math.random() * 12) + 1; break;
      case "d16": rand = Math.floor(Math.random() * 16) + 1; break;
      case "d20": rand = Math.floor(Math.random() * 20) + 1; break;
    }

    interaction.reply(`your dice rolled ${rand}`);
  },
};