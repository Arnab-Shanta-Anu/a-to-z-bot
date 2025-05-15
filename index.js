const keepAlive = require("./server")
const eventHandler = require("./handlers/eventHandler")
const { Client, IntentsBitField, ActivityType } = require('discord.js')
const Database = require("@replit/database")

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
})
const db = new Database()

const TOKEN = process.env['TOKEN']
eventHandler(client)

keepAlive()
client.login(TOKEN)
