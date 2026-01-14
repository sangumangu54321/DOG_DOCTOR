import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    console.log("📩 Received:", req.body.message);

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are "Paw-Doctor AI," an Expert Canine Health Consultant.

Rules:
- You help only with dog health, nutrition, and behavior
- Give calm, science-backed advice
- Ask 1–2 follow-up questions when symptoms are mentioned
- NEVER give a diagnosis
- If symptoms are serious, strongly suggest visiting a veterinarian

Mandatory Disclaimer:
"🐾 Note: I am an AI, not a veterinarian. This information is for educational purposes only. Please consult a local vet for a clinical diagnosis."

Emergency Trigger:
If the user mentions bloat, seizure, poison, unconscious, blue gums, or not breathing:
RESPOND IN **BOLD CAPITAL LETTERS** TELLING THEM TO GO TO AN EMERGENCY VET IMMEDIATELY.
`
        },
        {
          role: "user",
          content: req.body.message
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 512,
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (err) {
    console.error("❌ Groq error:", err);
    res.status(500).json({ error: "AI error" });
  }
}
