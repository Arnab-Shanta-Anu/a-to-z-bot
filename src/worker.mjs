/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from "itty-router";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { AWW_COMMAND, INVITE_COMMAND, ROLL_COMMAND } from "./commands.mjs";
import { InteractionResponseFlags } from "discord-interactions";

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get("/", (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post("/", async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env
  );
  if (!isValid || !interaction) {
    return new Response("Bad request signature.", { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
      case AWW_COMMAND.name.toLowerCase(): {
        // const cuteUrl = await getCuteUrl();
        // An interaction
        return new Response(
          JSON.stringify({
            type: 4, // Respond with a message
            data: {
              content: "👋 Hello from the bot!",
            },
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      case INVITE_COMMAND.name.toLowerCase(): {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      case ROLL_COMMAND.name.toLowerCase(): {
        const sides = interaction.data.options.find(
          (opt) => opt.name === "sides"
        )?.value;
        const count =
          interaction.data.options.find((opt) => opt.name === "count")?.value ||
          1;

        if (count > 100) {
          return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "🚫 You can only roll up to 100 dice at once.",
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        }

        const rolls = Array.from(
          { length: count },
          () => Math.floor(Math.random() * sides) + 1
        );
        const result = rolls.sort((a, b) => b - a).join(", ");
        const total = rolls.reduce((sum, val) => sum + val, 0);
        const reply = `🎲 Rolled **${count}d${sides}**: [${result}] (Total: **${total}**)`;

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: reply,
          },
        });
      }

      default:
        return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
    }
  }

  console.error("Unknown Type");
  return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
});
router.all("*", () => new Response("Not Found.", { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;
