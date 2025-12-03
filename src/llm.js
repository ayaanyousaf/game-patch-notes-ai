import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompt.js";
import { getNextVersion, getCurrentDate } from "./tools.js";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generatePatchNotes(userInput) {
  const startTime = Date.now();

  try {
    // Combine system prompt + user content
    const prompt = `${SYSTEM_PROMPT}\n\nUSER CHANGES:\n${userInput}`;

    // Generate content from Gemini
    const result = await model.generateContent(prompt);
    let output = result.response.text();

    // Detects the required tools to use
    const needsVersion = output.includes("[TOOL:getNextVersion]");
    const needsDate = output.includes("[TOOL:getCurrentDate]");

    let version = null;
    let date = null;

    if (needsVersion) {
      const v = getNextVersion();
      version = v.version;
      output = output.replace(
        "[TOOL:getNextVersion]",
        `Patch Notes v${version}`
      );
    }

    if (needsDate) {
      const d = getCurrentDate();
      date = d.date;
      output = output.replace("[TOOL:getCurrentDate]", date);
    }

    // Telemetry logging
    const latency = Date.now() - startTime;
    console.log({
      timestamp: new Date().toISOString(),
      model: "gemini-2.5-flash",
      usedVersionTool: needsVersion,
      usedDateTool: needsDate,
      latencyMs: latency,
    });

    return {
      patchNotes: output,
      version,
      date,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      patchNotes: null,
      version: null,
      date: null,
    };
  }
}
