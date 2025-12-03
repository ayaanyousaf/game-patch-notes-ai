document.getElementById("generateBtn").addEventListener("click", async () => {
  const input = document.getElementById("input").value.trim();
  const outputContainer = document.getElementById("outputContainer");
  const output = document.getElementById("output");

  if (!input) {
    outputContainer.classList.remove("hidden");
    output.textContent = "Please enter some updates first.";
    return;
  }

  // Display loading state
  outputContainer.classList.remove("hidden");
  output.textContent = "Generating patch notes...";

  try {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes: input }),
    });

    const data = await res.json();

    if (data.error) {
      output.textContent = "Error: " + data.error;
      return;
    }

    // Display final patch notes outputted by LLM
    output.textContent = data.patchNotes;
  } catch (err) {
    output.textContent = "Error: Could not reach server.";
  }
});
