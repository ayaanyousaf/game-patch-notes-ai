import fs from "fs";
import path from "path";

const TEST_PATH = path.join(process.cwd(), "tests", "tests.json");
const API_URL = "http://localhost:3000/api/generate";

async function runTests() {
  console.log("=== PatchGen Automated Testing ===\n");

  // Load tests.json
  const file = fs.readFileSync(TEST_PATH, "utf8");
  const tests = JSON.parse(file);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`Test: ${test.name}`);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: test.input }),
      });

      const data = await response.json();

      // If test expects an error
      if (test.expectError) {
        if (data.error && data.error.includes(test.expectError)) {
          console.log("   ✔ Passed (caught expected error)\n");
          passed++;
        } else {
          console.log(`   ❌ Failed: Expected error "${test.expectError}"`);
          console.log("   Response:", data, "\n");
          failed++;
        }
        continue;
      }

      // For normal tests, ensure patchNotes exists
      if (!data.patchNotes) {
        console.log("   ❌ Failed: No patchNotes returned\n");
        failed++;
        continue;
      }

      // Check expected substrings
      let allFound = true;
      for (const phrase of test.expectedContains || []) {
        if (!data.patchNotes.includes(phrase)) {
          console.log(`   ❌ Missing expected content: "${phrase}"`);
          allFound = false;
        }
      }

      if (allFound) {
        console.log("   ✔ Passed\n");
        passed++;
      } else {
        failed++;
        console.log("");
      }
    } catch (err) {
      console.log("   ❌ Error calling API:", err, "\n");
      failed++;
    }
  }

  console.log("=== Test Summary ===");
  console.log(`✔ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("====================\n");
}

runTests();
