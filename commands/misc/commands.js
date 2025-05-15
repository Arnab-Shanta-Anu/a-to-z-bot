module.exports = {
  name: 'commands',
  description: 'shows a list of commands available',
  // devOnly: Boolean,
  testOnly: false,
  // options: Object[],
  // deleted: Boolean,

  callback: (client, interaction) => {
    const embed = {
      title: "Commands",
      description: "Here are the commands you can use",
      fields:[
        {
          name: "!ping",
          value: "replies with pong"
        },
        {
          name: "!M8[space]your question",
          value: "get reply with yes/no/maybe"
        },
        {
          name: "!pick [this] or [that]",
          value: "replies one item randomly"
        }
      ],
      image: { url: client.user.avatarURL({}) },
      footer: { text: "A-Z bot" }
    }
    interaction.reply({ embeds: [embed] });
  },
};