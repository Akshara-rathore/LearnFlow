import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to external MongoDB");
        return;
      } catch (externalErr) {
        console.error("Failed to connect to external MongoDB:", externalErr.message);
        console.log("Falling back to embedded MongoDB...");
      }
    } else {
      console.log("No MONGODB_URI provided. Starting temporary embedded MongoDB for local development...");
    }
    
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to Embedded MongoDB at ${uri}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();

// Optional local-dev fix for self-signed certificate environments
if (process.env.ALLOW_INSECURE_TLS === "true") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn("⚠️ Insecure TLS mode enabled for local development.");
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

function extractJson(rawText) {
  const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("No valid JSON object found");
  }
}

function fallbackRoadmap(course, detectedLevel) {
  return {
    summary: `You are currently at ${detectedLevel} level in ${course}. Focus on this 4-week plan to improve steadily.`,
    weeks: [
      {
        week: 1,
        topic: `Core Basics of ${course}`,
        goals: ["Understand syntax", "Variables and data types", "Basic control flow"],
        leetcode: detectedLevel === "Advanced" ? ["Two Sum", "Valid Parentheses"] : ["Basic I/O", "Simple Math"]
      },
      {
        week: 2,
        topic: "Data Structures & Functions",
        goals: ["Arrays/Lists", "Objects/Dictionaries", "Writing reusable functions"],
        leetcode: ["Reverse String", "Contains Duplicate"]
      },
      {
        week: 3,
        topic: "Intermediate Concepts",
        goals: ["Object Oriented Programming", "Error Handling", "File I/O"],
        leetcode: ["Merge Two Sorted Lists", "Maximum Subarray"]
      },
      {
        week: 4,
        topic: "Advanced Topics & Projects",
        goals: ["Async programming", "Build a small project", "Interview prep"],
        leetcode: ["Best Time to Buy and Sell Stock", "Climbing Stairs"]
      }
    ],
    resources: [
      "Official documentation",
      "YouTube tutorials for fundamentals",
      "Practice platforms like LeetCode or HackerRank",
    ],
    tips: [
      "Practice 30 to 60 minutes daily",
      "Track your weak areas",
      "Build one small project after completing basics",
    ],
  };
}

function fallbackQuiz(course) {
  const c = course || "this subject";
  return [
    {
      question: `What is the primary purpose of ${c}?`,
      options: ["Building interfaces", "Managing databases", "General purpose programming", "Solving specific domain problems"],
      answer: "General purpose programming",
      explanation: `${c} is widely used for various general programming tasks.`
    },
    {
      question: `Which of the following is a key feature of ${c}?`,
      options: ["Static typing", "Dynamic typing", "Manual memory management", "Platform dependence"],
      answer: "Dynamic typing",
      explanation: `Many modern languages like ${c} feature dynamic typing for flexibility.`
    },
    {
      question: `How do you declare a variable in ${c}?`,
      options: ["var / let / const", "int / string", "declare", "variable"],
      answer: "var / let / const",
      explanation: `These are common variable declaration keywords.`
    },
    {
      question: `What is a common use case for ${c}?`,
      options: ["Web development", "System programming", "Game engine development", "Hardware drivers"],
      answer: "Web development",
      explanation: `${c} is extremely popular in web development.`
    },
    {
      question: `Which data structure is most commonly used in ${c} for key-value pairs?`,
      options: ["Array", "List", "Object / Dictionary", "Tuple"],
      answer: "Object / Dictionary",
      explanation: `Objects or dictionaries are standard for key-value storage.`
    },
    {
      question: `How do you define a function in ${c}?`,
      options: ["def", "function", "func", "Depends on the syntax"],
      answer: "Depends on the syntax",
      explanation: `Function definitions vary, but 'function' or 'def' are common.`
    },
    {
      question: `What is the typical file extension for ${c}?`,
      options: [".js", ".py", ".html", "Depends on the language"],
      answer: "Depends on the language",
      explanation: `The extension matches the specific language of ${c}.`
    },
    {
      question: `Which of the following is a framework/library associated with ${c}?`,
      options: ["React / Django", "Spring Boot", "Laravel", "None of the above"],
      answer: "React / Django",
      explanation: `Popular languages often have major frameworks like React or Django.`
    },
    {
      question: `What is the standard package manager for ${c}?`,
      options: ["npm / pip", "maven", "composer", "gem"],
      answer: "npm / pip",
      explanation: `NPM and PIP are very common package managers.`
    },
    {
      question: `How does ${c} handle errors?`,
      options: ["Try / Catch", "Error codes", "Panics", "Silent failures"],
      answer: "Try / Catch",
      explanation: `Try/catch blocks are the standard way to handle exceptions.`
    }
  ];
}

function formatDuration(isoDuration) {
  if (!isoDuration) return "N/A";

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "N/A";

  const hours = match[1] ? `${match[1]}h ` : "";
  const minutes = match[2] ? `${match[2]}m ` : "";
  const seconds = match[3] ? `${match[3]}s` : "";

  return `${hours}${minutes}${seconds}`.trim();
}

function generateNotesFromRoadmap(course, level, roadmap) {
  if (!Array.isArray(roadmap?.weeks)) {
    return [{
      week: 1,
      title: "Study Notes",
      content: `Focus on improving your ${course} skills at a ${level} level.`,
      keyPoints: ["Understand basics"],
      example: "Consider starting with a Hello World program.",
      practiceTask: "Write a small script and run it."
    }];
  }

  return roadmap.weeks.map(w => ({
    week: w.week || 1,
    title: `Week ${w.week}: ${w.topic || "Study Plan"}`,
    content: `This week focuses on ${w.topic || "core concepts"}. Make sure to dedicate enough time to practice and understand the underlying mechanics of ${course}.`,
    keyPoints: Array.isArray(w.goals) ? w.goals : ["Focus on weekly goals."],
    example: `Review documentation for ${w.topic || "this topic"} to see practical examples. Building small snippets helps cement knowledge.`,
    practiceTask: `Complete at least one practice project or problem related to ${w.topic || "this week's topic"}.`
  }));
}

function getLeetCodeQuestions(course, level) {
  const mapping = {
    Beginner: [
      { title: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/", topic: "Array" },
      { title: "Valid Parentheses", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/", topic: "Stack" },
      { title: "Merge Two Sorted Lists", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/", topic: "Linked List" },
      { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", topic: "Array" }
    ],
    Intermediate: [
      { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", topic: "String" },
      { title: "Group Anagrams", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/", topic: "Hash Table" },
      { title: "Product of Array Except Self", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/", topic: "Array" },
      { title: "Coin Change", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/", topic: "Dynamic Programming" }
    ],
    Advanced: [
      { title: "Median of Two Sorted Arrays", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", topic: "Array" },
      { title: "Trapping Rain Water", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/", topic: "Two Pointers" },
      { title: "Word Ladder", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/", topic: "Graph" },
      { title: "N-Queens", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/", topic: "Backtracking" }
    ]
  };

  return mapping[level] || mapping.Beginner;
}

const MOCK_VIDEO_MAP = {
  python: ["_uQrJ0TkZlc", "kqtD5dpn9C8", "Z1Yd7upQsXY", "rfscVS0vtbw"],
  javascript: ["PkZNo7MF68v", "W6NZfCO5SIk", "hdI2bqOjy3c", "jS4aFq5-91M"],
  java: ["A74TOX803D0", "eIrMbAQSU34", "grEKMHGYyns", "GoXwIVooIvU"],
  cpp: ["vLnPwxZdW4Y", "8jLOx1hD3_o", "ZzaPdXTrSb8", "1v_4d6lsQoU"],
  default: ["_uQrJ0TkZlc", "PkZNo7MF68v", "A74TOX803D0", "vLnPwxZdW4Y"]
};

function getMockVideos(course, level, roadmap) {
  const weeks = Array.isArray(roadmap?.weeks) ? roadmap.weeks.slice(0, 4) : [];
  const langKey = String(course).toLowerCase();
  const videoIds = MOCK_VIDEO_MAP[langKey] || MOCK_VIDEO_MAP.default;
  
  return weeks.map((w, index) => {
    const vid = videoIds[index % videoIds.length];
    return {
      videoId: vid,
      title: `${course} - ${w.topic || "Topic " + (index + 1)} (${level} Tutorial)`,
      channelTitle: "Tech Mastery",
      description: `Learn ${w.topic || "this topic"} in this comprehensive crash course tailored for ${level} level.`,
      thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${vid}`,
      duration: "1h 30m",
      week: w.week || index + 1,
      topic: w.topic || "General Concept",
    };
  });
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  options.signal = controller.signal;

  try {
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    const text = await response.text();

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return { response, data, text };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

app.post("/generate-quiz", async (req, res) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "course is required",
      });
    }

    const prompt = `
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT use backticks.

Generate exactly 10 multiple choice questions for ${course}.

Rules:
- Each question must have exactly 4 options.
- The answer must be the exact correct option text.
- Keep explanations short.

Format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Option 1",
      "explanation": "Short explanation"
    }
  ]
}
`;

    const { response: ollamaResponse, data } = await fetchJson(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3:mini",
          prompt,
          stream: false,
          options: {
            temperature: 0.2,
            num_predict: 800,
          },
        }),
      }
    );

    if (!ollamaResponse.ok) {
      return res.json({
        success: true,
        questions: fallbackQuiz(course),
      });
    }

    if (!data.response) {
      return res.status(500).json({
        success: false,
        message: "No response field received from Ollama",
      });
    }

    let parsedQuiz;
    try {
      parsedQuiz = extractJson(data.response);
    } catch {
      return res.status(500).json({
        success: false,
        message: "Ollama returned invalid quiz JSON",
        raw: data.response,
      });
    }

    if (!parsedQuiz || !Array.isArray(parsedQuiz.questions)) {
      return res.json({
        success: true,
        questions: fallbackQuiz(course),
      });
    }

    const cleanedQuestions = parsedQuiz.questions
      .map((q) => ({
        question: typeof q.question === "string" ? q.question.trim() : "",
        options: Array.isArray(q.options)
          ? q.options.map(String).slice(0, 4)
          : [],
        answer: typeof q.answer === "string" ? q.answer.trim() : "",
        explanation:
          typeof q.explanation === "string"
            ? q.explanation.trim()
            : "No explanation provided.",
      }))
      .filter((q) => q.question && q.options.length === 4 && q.answer);

    if (!cleanedQuestions.length) {
      return res.json({
        success: true,
        questions: fallbackQuiz(course),
      });
    }

    return res.json({
      success: true,
      questions: cleanedQuestions,
    });
  } catch (error) {
    console.error("Quiz server error:", error);
    return res.json({
      success: true,
      questions: fallbackQuiz(req.body.course),
    });
  }
});

app.post("/generate-roadmap", async (req, res) => {
  try {
    const { course, score, total, percentage, detectedLevel } = req.body;

    if (
      !course ||
      score === undefined ||
      total === undefined ||
      percentage === undefined ||
      !detectedLevel
    ) {
      return res.status(400).json({
        success: false,
        message:
          "course, score, total, percentage, and detectedLevel are required",
      });
    }

    const prompt = `
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT use backticks.
Do NOT include any explanation outside JSON.

Create a personalized 4-week study roadmap for ${course}.

Student details:
- Score: ${score} out of ${total}
- Percentage: ${percentage}%
- Detected Level: ${detectedLevel}

Use EXACTLY this format:
{
  "summary": "Short summary of the 4-week plan",
  "weeks": [
    {
      "week": 1,
      "topic": "Topic Name",
      "goals": ["goal 1", "goal 2"],
      "leetcode": ["Problem Name 1", "Problem Name 2"]
    },
    { "week": 2, "topic": "...", "goals": [], "leetcode": [] },
    { "week": 3, "topic": "...", "goals": [], "leetcode": [] },
    { "week": 4, "topic": "...", "goals": [], "leetcode": [] }
  ],
  "resources": ["resource1", "resource2"],
  "tips": ["tip1", "tip2"]
}
`;

    const { response: ollamaResponse, data } = await fetchJson(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3:mini",
          prompt,
          stream: false,
          options: {
            temperature: 0.2,
            num_predict: 600,
          },
        }),
      }
    );

    if (!ollamaResponse.ok) {
      return res.status(500).json({
        success: false,
        message: "Failed to get roadmap from Ollama",
        error: data,
      });
    }

    if (!data.response) {
      return res.json({
        success: true,
        roadmap: fallbackRoadmap(course, detectedLevel),
      });
    }

    let parsedRoadmap;
    try {
      parsedRoadmap = extractJson(data.response);
    } catch {
      return res.json({
        success: true,
        roadmap: fallbackRoadmap(course, detectedLevel),
      });
    }

    const fallback = fallbackRoadmap(course, detectedLevel);

    const safeRoadmap = {
      summary:
        typeof parsedRoadmap.summary === "string"
          ? parsedRoadmap.summary
          : fallback.summary,
      weeks: Array.isArray(parsedRoadmap.weeks)
        ? parsedRoadmap.weeks
        : fallback.weeks,
      resources: Array.isArray(parsedRoadmap.resources)
        ? parsedRoadmap.resources.map(String)
        : fallback.resources,
      tips: Array.isArray(parsedRoadmap.tips)
        ? parsedRoadmap.tips.map(String)
        : fallback.tips,
    };

    return res.json({
      success: true,
      roadmap: safeRoadmap,
    });
  } catch (error) {
    console.error("Roadmap server error:", error);

    return res.json({
      success: true,
      roadmap: fallbackRoadmap(
        req.body.course || "this subject",
        req.body.detectedLevel || "Beginner"
      ),
    });
  }
});

app.post("/generate-resources", async (req, res) => {
  try {
    const { course, level, roadmap } = req.body;

    if (!course || !level || !roadmap) {
      return res.status(400).json({
        success: false,
        message: "course, level, and roadmap are required",
      });
    }

    const notes = generateNotesFromRoadmap(course, level, roadmap);
    const leetcode = getLeetCodeQuestions(course, level);

    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === "your_youtube_api_key") {
      return res.json({
        success: true,
        videos: getMockVideos(course, level, roadmap),
        notes,
        leetcode,
        warning: "Using mocked videos because YOUTUBE_API_KEY is not set or invalid",
      });
    }

    try {
      const videos = [];
      const weeks = Array.isArray(roadmap?.weeks) ? roadmap.weeks.slice(0, 4) : [];

      for (let i = 0; i < weeks.length; i++) {
        const week = weeks[i];
        if (!week.topic) continue;

        let levelModifier = "tutorial";
        if (level === "Beginner") levelModifier = "basics fundamentals tutorial";
        else if (level === "Intermediate") levelModifier = "project object oriented tutorial";
        else if (level === "Advanced") levelModifier = "advanced optimization tutorial";

        const searchQuery = `${course} ${level} ${week.topic} ${levelModifier}`;
        console.log("YouTube search query for week", week.week, ":", searchQuery);

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(
          searchQuery
        )}&videoEmbeddable=true&safeSearch=moderate&relevanceLanguage=en&key=${process.env.YOUTUBE_API_KEY}`;

        const { response: searchResponse, data: searchData } = await fetchJson(searchUrl);

        if (!searchResponse.ok || !searchData.items || searchData.items.length === 0) {
          continue;
        }

        const videoIds = searchData.items
          .map((item) => item.id?.videoId)
          .filter(Boolean)
          .join(",");

        if (!videoIds) continue;

        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,status,contentDetails&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`;
        const { data: detailsData } = await fetchJson(detailsUrl);

        let validVideo = null;

        if (detailsData?.items) {
          for (const item of detailsData.items) {
            if (item.status?.embeddable === false) continue;
            if (!item.snippet?.thumbnails?.high && !item.snippet?.thumbnails?.medium) continue;

            validVideo = item;
            break;
          }
        }

        if (validVideo) {
          videos.push({
            week: week.week || i + 1,
            topic: week.topic,
            title: validVideo.snippet.title,
            url: `https://www.youtube.com/watch?v=${validVideo.id}`,
            thumbnail:
              validVideo.snippet.thumbnails?.high?.url ||
              validVideo.snippet.thumbnails?.medium?.url,
            channelTitle: validVideo.snippet.channelTitle,
          });
        }
      }

      if (videos.length === 0) {
        return res.json({
          success: false,
          message: "Failed to find any verified YouTube videos.",
          videos: [],
          notes,
          leetcode,
        });
      }

      return res.json({
        success: true,
        videos,
        notes,
        leetcode,
      });
    } catch (youtubeError) {
      console.error("YouTube fetch error:", youtubeError);

      return res.json({
        success: true,
        videos: getMockVideos(course, level, roadmap),
        notes,
        leetcode,
        warning: "Videos could not be fetched, but notes were generated.",
      });
    }
  } catch (error) {
    console.error("Resources server error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate resources",
      error: error.message,
    });
  }
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});