# PatchGen
##### Author: Ayaan Yousaf
## 📝 Overview
▶️ Demo Video - Coming soon...

An LLM-powered web application that converts raw updates for videogames into clean, structured, professional developer patch notes.  

Built with Node.js, Express, Google Gemini API, and Tailwind CSS.

This application uses the Gemini 2.5 Flash model for text generation. The model can be swapped by modifying ```src/llm.js```.

![PatchGen Demo](assets/PatchGen_DEMO.gif)
---

## ⚙️ Setup Instructions
#### Prerequisites: Node.js, Express, Google account for Gemini
### 1. Clone the repository
```bash
git clone https://github.com/ayaanyousaf/game-patch-notes-ai.git
cd game-patch-notes-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your .env file
```bash 
cp .env.example .env
```
Then open .env and add your Gemini API key: 
```ini
GEMINI_API_KEY=your_key_here
```
#### Getting a Gemini API key (free)
Visit: https://makersuite.google.com/app/apikey <br>
Create a key --> paste it into .env

### 4. Running the Application
One command to start the server + frontend: 
```bash
npm start
```
Then, for testing use: 
```bash
node tests/runTests.js
```

---

## ⚡Features

- Generates organized patch notes from raw bullet points  
- Automatic version + date insertion via tool use  
- Input validation, length guard, and prompt-injection filtering  
- Telemetry logging for each request  
- Offline evaluation suite with 15 unique tests
- Simple, clean UI with a copy output button 

---

## 👨🏻‍💻 Tech Stack
- **Node.js** – backend runtime  
- **Express.js** – HTTP server & routing  
- **Google Gemini API** – LLM text generation  
- **Tailwind CSS** – minimal UI styling  
- **HTML + JavaScript** – browser interface  
- **dotenv** – environment variable management  

---

## 🚧 Future Improvements
- Implement caching and rate-limiting
- Expand user interface into a chat-like interface
- Add modern icons for all buttons
- Integrate additional LLM models or allow model selection
- Add text animations for LLM output
- Implement exporting patch notes to PDF/Markdown