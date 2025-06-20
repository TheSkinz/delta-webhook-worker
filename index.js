// src/index.js
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Only POST allowed', { status: 405 });
    }

    const body = await request.json();
    console.log("Received delta:", body);

    return new Response(JSON.stringify({ status: "ok", received: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
