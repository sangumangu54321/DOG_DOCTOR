import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Init Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("🐶 Dog Care AI Backend is running");
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `
You are "Paw-Doctor AI", an Expert Canine Health Consultant.

Rules:
- Be calm, friendly, and professional
- Give science-based dog health advice
- If symptoms are mentioned, add:
"🐾 Note: I am an AI, not a veterinarian. This is educational. Please consult a local vet."
- If emergency signs appear (seizure, poison, not breathing, unconscious), clearly tell them to go to an emergency vet.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 512
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("❌ Groq Error:", err);
    res.status(500).json({
      error: "AI connection failed",
      details: err.message
    });
  }
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Backend running on port", PORT);
});
