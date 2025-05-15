const { REST, Routes } = require('discord.js');
const commands = [
  {
    name: 'roll',
    description: 'Rolls a dice',
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
      { body: commands },
    );
    console.log('Commands registered.');
  } catch (error) {
    console.error(error);
  }
})();
