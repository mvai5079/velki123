export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Hardcoded Admin Password
  // In a real app, use environment variables, but for simplicity here we hardcode it.
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'musa123'; // The client should use this to login

  // Helper to handle CORS if needed
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (request.method === 'GET') {
    if (url.searchParams.get('action') === 'verify') {
      // Handle login verification
      const authHeader = request.headers.get('Authorization');
      if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    // Return the current config
    let config = {
      whatsappNumber: "916382583846",
      messengerLink: "https://www.facebook.com/170687"
    };

    try {
      if (env.MUSAA_CONFIG) {
        const stored = await env.MUSAA_CONFIG.get('contact_links', { type: 'json' });
        if (stored) {
          config = stored;
        }
      }
    } catch (e) {
      // Fallback to default if KV fails or doesn't exist
    }

    return new Response(JSON.stringify(config), { status: 200, headers });
  }

  if (request.method === 'POST') {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    try {
      const data = await request.json();
      
      if (!env.MUSAA_CONFIG) {
        return new Response(JSON.stringify({ error: 'KV Namespace not bound' }), { status: 500, headers });
      }

      await env.MUSAA_CONFIG.put('contact_links', JSON.stringify({
        whatsappNumber: data.whatsappNumber || "",
        messengerLink: data.messengerLink || ""
      }));

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }

  return new Response('Method Not Allowed', { status: 405, headers });
}
