const {ApplicationCommandOptionType} = require("discord.js")
module.exports = {
  name: 'pick',
  description: 'pick 1 randomly between 2 options',
  // devOnly: Boolean,
  testOnly: false,
  options: [{
    name: "option1",
    description: "first item",
    type: ApplicationCommandOptionType.String,
    required: true
  },
  {
    name: "option2",
    description: "second item",
    type: ApplicationCommandOptionType.String,
    required: true
  }],
  // deleted: Boolean,

  callback: (client, interaction) => {
    let options=[];
    options.push(interaction.options.get("option1"));
    options.push(interaction.options.get("option2"));
    let rand = Math.floor(Math.random()*2)
    interaction.reply(`My choice is ${options[rand].value}`);
  },
};