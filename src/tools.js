import fs from "fs";
import path from "path";

// Return current date in YYYY-MM-DD format
export function getCurrentDate() {
  const now = new Date();
  return { date: now.toISOString().split("T")[0] };
}

const versionFile = path.join(process.cwd(), "version.json");

// Generate and save the next version number
export function getNextVersion() {
  // Create version.json if missing
  if (!fs.existsSync(versionFile)) {
    fs.writeFileSync(
      versionFile,
      JSON.stringify({ current: "1.0.0" }, null, 2)
    );
  }

  const content = JSON.parse(fs.readFileSync(versionFile, "utf8"));
  const [major, minor, patch] = content.current.split(".").map(Number);

  const newVersion = `${major}.${minor}.${patch + 1}`;

  content.current = newVersion;
  fs.writeFileSync(versionFile, JSON.stringify(content, null, 2));

  return { version: newVersion };
}
