import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generatePatchNotes } from "./llm.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Game Patch Notes AI server is running...");
});

// Patch note generation route (placeholder)
app.post("/api/generate", async (req, res) => {
  const { changes } = req.body;

  // Validation
  if (!changes || typeof changes !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'changes' field." });
  }

  // Long input check
  if (changes.length > 2000) {
    return res.status(400).json({ error: "Error: input too long." });
  }

  // Check obvious prompt injection BEFORE LLM call
  if (/ignore previous instructions/i.test(changes))
    return res.status(400).json({ error: "Error: unsafe input detected." });

  // Patch note generation using LLM and user input
  try {
    const result = await generatePatchNotes(changes);

    if (!result || !result.patchNotes) {
      return res.status(500).json({ error: "Failed to generate patch notes." });
    }

    return res.json({
      patchNotes: result.patchNotes,
      version: result.version,
      date: result.date,
    });
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
