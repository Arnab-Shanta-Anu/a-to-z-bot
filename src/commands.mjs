export const AWW_COMMAND = {
  name: "awwww",
  description: "Drop some cuteness on this channel.",
};

export const INVITE_COMMAND = {
  name: "invite",
  description: "Get an invite link to add the bot to your server",
};

export const ROLL_COMMAND = {
  name: "roll",
  description: "roll a dice",
  options: [
    {
      name: "sides",
      description: "Number of sides on the dice",
      type: 4, // INTEGER
      required: true,
      choices: [
        { name: "d4", value: 4 },
        { name: "d6", value: 6 },
        { name: "d8", value: 8 },
        { name: "d10", value: 10 },
        { name: "d12", value: 12 },
        { name: "d20", value: 20 },
        { name: "d100", value: 100 },
      ],
    },
    {
      name: "count",
      description: "Number of dice to roll",
      type: 4, // INTEGER
      required: false,
    },
  ],
};

export const COMMANDS = [AWW_COMMAND, INVITE_COMMAND, ROLL_COMMAND];
