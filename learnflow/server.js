import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate-quiz", async (req, res) => {
  try {
    const { course, level } = req.body;

    if (!course || !level) {
      return res.status(400).json({
        success: false,
        message: "course and level are required",
      });
    }

    const prompt = `
Generate exactly 5 multiple choice questions for ${course} at ${level} level.

Return ONLY valid JSON.
No markdown.
No explanation outside JSON.

Use this exact format:
[
  {
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Short explanation"
  }
]
`;

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        format: "json",
        stream: false,
      }),
    });

    const data = await ollamaResponse.json();

    console.log("Raw Ollama response:", data.response);

    let quiz;

    try {
      quiz = JSON.parse(data.response);
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(500).json({
        success: false,
        message: "Model did not return valid JSON",
        raw: data.response,
      });
    }

    if (!Array.isArray(quiz) || quiz.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Quiz data is empty or invalid",
        raw: quiz,
      });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});