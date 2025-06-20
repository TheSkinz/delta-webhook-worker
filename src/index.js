// src/index.js
export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    const data = await request.json();
    console.log("Received delta:", JSON.stringify(data, null, 2));

    const assistantId = ASSISTANT_ID;
const apiKey = OPENAI_API_KEY;



    try {
      // 1. Create a new thread
      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      const { id: threadId } = await threadRes.json();

      // 2. Post message to that thread
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

      // 3. Run the assistant on the thread
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

    } catch (err) {
      console.error("Failed to send delta to OpenAI:", err);
    }

    return new Response(JSON.stringify({ status: "ok", forwarded: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};

