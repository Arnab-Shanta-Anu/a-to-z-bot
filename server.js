const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.send("Bot online!")
})

function keepAlive() {
  server.listen(3000, () => {
    console.log("Server ready!.")
  })
}

module.exports = keepAlive