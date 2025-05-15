addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY; // Get this from Discord Developer Portal
  
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
  
    const isValid = verifySignature(body, signature, timestamp, PUBLIC_KEY);
    if (!isValid) {
      return new Response('Bad request signature', { status: 401 });
    }
  
    const json = JSON.parse(body);
  
    // Discord PING request
    if (json.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    // Slash command logic
    if (json.type === 2) {
      const commandName = json.data.name;
  
      if (commandName === 'roll') {
        const rolled = Math.floor(Math.random() * 6) + 1;
        return new Response(JSON.stringify({
          type: 4,
          data: {
            content: `🎲 You rolled a ${rolled}!`,
          }
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  
    return new Response('Unhandled interaction type', { status: 400 });
  }
