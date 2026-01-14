import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const userMessage = req.body?.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are Paw-Doctor AI, a calm and friendly dog-care assistant. Always add a short safety disclaimer."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 512,
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server crashed",
      details: err.message
    });
  }
}
