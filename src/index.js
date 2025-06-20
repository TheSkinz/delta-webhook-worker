// src/index.js
export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method !== "POST") {
        return new Response("Only POST allowed", { status: 405 });
      }

      const data = await request.json();
      console.log("✅ Received delta:", JSON.stringify(data, null, 2));

      const apiKey = env.OPENAI_API_KEY;
      const assistantId = env.ASSISTANT_ID;

      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      const { id: threadId } = await threadRes.json();
      console.log("📌 Thread ID:", threadId);

      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: "user",
          content: `New delta received:\n\n${JSON.stringify(data, null, 2)}`
        })
      });

      await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      });

      return new Response(JSON.stringify({ status: "ok", forwarded: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("🔥 Worker crashed:", err.stack || err);
      return new Response("Internal Error", { status: 500 });
    }
  }
};
