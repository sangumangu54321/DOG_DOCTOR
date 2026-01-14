import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const userMessage = req.body?.message || "";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are Paw-Doctor AI, a kind canine health assistant. Always be calm, friendly, and give dog-care advice with a safety disclaimer."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 512,
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Groq error:", err);
    return res.status(500).json({
      error: "AI failed",
      details: err.message
    });
  }
}
