# Technical Summary
#### Author: Ayaan Yousaf

--- 

## Architecture Diagram
A quick overview of the system pipeline.

                ┌──────────────────────────────┐
                │       Frontend (Client)      │
                │  HTML + Tailwind UI (public) │
                |       Gets user input        |
                └───────────────┬──────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │         Express API          │
                │ - Input validation           │
                │ - Safety checks              │
                │ - Telemetry logging          │
                │ - Serves static UI           │
                └───────────────┬──────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │         Gemini LLM           │
                │ - Rewrites patch notes       │
                │ - Groups by categories       │
                │ - Uses tools:                │
                │   [TOOL:getNextVersion]      │
                │   [TOOL:getCurrentDate]      │
                └───────────────┬──────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │    Tool Handler (tools.js)   │
                │ - Generates version numbers  │
                │ - Inserts current date       │
                └───────────────┬──────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │   Structured Patch Notes     │
                │ (sent back to frontend UI)   │
                └──────────────────────────────┘

The user interacts with a minimal HTML + Tailwind CSS interface and submits their raw updates as bullet points. This input is sent to the Express server as a JSON object, where it is validated, length-checked, and filtered for prompt injection. Valid requests are logged with telemetry metrics and passed to the Gemini LLM with a system prompt. The model rewrites the updates into organized patch notes and uses the tools for version/date tagging. Finally, the server returns the structured patch notes to the frontend, where they are displayed for the user to review and copy.

--- 

## Guardrails & Safety Measures
PatchGen applies many layers of protection to ensure safe and controlled LLM behavior:

- **Input Validation**
  - Ensures the `changes` field exists and is a valid string  
  - Rejects empty or unexpected JSON payloads  

- **Character Limit**
  - Prevents inputs longer than 2000 characters  

- **Prompt Injection Detection**
  - Filters out attempts to override system behaviour
  - Detects phrases like *"ignore previous instructions"*  
  - Returns an error instead of forwarding unsafe input to the LLM  

- **System Prompt Reinforcement**
  - Enforces consistent patch notes formatting and structure.
  - Prevents unsafe requests from influencing the model
  - Requires the model to use tools (e.g., `[TOOL:getNextVersion]`) instead of generating its own random values  

- **Error Handling & Safe Fallbacks**
  - If the LLM response is incomplete or missing, the server returns a safe error message  
  - Prevents incorrect or partially generated output from reaching users  

---

## Evaluation Method
PatchGen also features offline evaluation with 15 unique tests to verify correctness and safety.

The evaluation method includes: 

- **Categorization Tests**
  - These ensure that the LLM is correctly grouping updating into valid sections such as Weapons, Abilities, Maps, etc.

- **Formatting and Messy Input Tests**
  - These tests mensure that the LLM is able to process messy user input that may not be in the expected format. For example, input that is all on one line, or with excessive whitespace.

- **Guardrail Tests**
  - Tests to check if long inputs are handled correctly, and if the LLM is able to reliably check for prompt injection.

- **Tool Use Verification**
  - Tests to ensure the LLM is correctly using tools for version/date tagging.

- **Execution**
  - Overall, every test evaluates if the app runs correctly and produces the expected output.

---

## Known Limitations
- **LLM Output Varies:**
  Output will vary each time you generate patch notes, even with the same inputs.

- **Ambigious Categories:**
  Some updates may not clearly be categorized, as the LLM may fail to group them.

- **Minimal UI:**
  The UI can be improved significantly and include features like history, themes, and additional editing tools.

- **Focused Task: Games**
  Since this is specifically designed for video game patch notes, it will likely not work with other patch notes. This application can be expanded to support all types of patch notes.