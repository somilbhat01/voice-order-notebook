const fs = require("fs");

async function transcribe(filePath) {
  const form = new FormData();
  form.append("audio_file", new Blob([fs.readFileSync(filePath)]), "audio.wav");
  form.append("language_code", "hi-IN");

  const res = await fetch("https://api.vachana.ai/stt/v3", {
    method: "POST",
    headers: { "X-API-Key-ID": process.env.GNANI_API_KEY },
    body: form,
  });

  const data = await res.json();
  return data.transcript;
}

module.exports = { transcribe };

if (require.main === module) {
  transcribe("test.wav").then((t) => console.log("Transcript:", t));
}
