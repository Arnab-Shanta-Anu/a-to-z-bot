import "dotenv/config";
import fetch from "node-fetch";
import deepEqual from "deep-equal"; // install with: npm install deep-equal
import { COMMANDS } from "./commands.mjs";

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server.  It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error("The DISCORD_TOKEN environment variable is required.");
}
if (!applicationId) {
  throw new Error(
    "The DISCORD_APPLICATION_ID environment variable is required."
  );
}

async function fetchExistingCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch existing commands");
    const text = await response.text();
    console.error(text);
    return [];
  }

  return await response.json();
}

function commandsAreDifferent(existing, local) {
  const byName = Object.fromEntries(existing.map((cmd) => [cmd.name, cmd]));
  return local.some((localCmd) => {
    const existingCmd = byName[localCmd.name];
    return !existingCmd || !deepEqual(stripCommand(existingCmd), localCmd);
  });
}

// Remove auto-added fields from existing commands
function stripCommand(cmd) {
  const { id, application_id, version, default_permission, ...stripped } = cmd;
  return stripped;
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
async function registerGlobalCommands() {
  const existing = await fetchExistingCommands();

  if (!commandsAreDifferent(existing, COMMANDS)) {
    console.log("No command changes detected. Skipping registration.");
    return;
  }

  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await registerCommands(url);
}

async function registerCommands(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(COMMANDS),
  });

  if (response.ok) {
    console.log("Registered all commands");
  } else {
    console.error("Error registering commands");
    const text = await response.text();
    console.error(text);
  }
  return response;
}

await registerGlobalCommands();
