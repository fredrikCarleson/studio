/**
 * Generate the blueprint narration MP3 for stage playback.
 *
 * Usage:
 *   npx tsx scripts/generate-narration.ts
 *
 * Prerequisites:
 *   - GOOGLE_API_KEY or GOOGLE_GENAI_API_KEY env var set
 *   - npm install (project deps already include genkit + google-genai)
 *
 * Output:
 *   public/audio/blueprint-narration.mp3
 */

import { ai } from "../src/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";
import * as fs from "fs";
import * as path from "path";

const NARRATION_TEXT = `
Hi Fredrik. Of course I can explain the diagram for you.

This is the five-phase swarm architecture we built during the hackathon.

Phase one starts with a parallel multi-modal scraper. The channel mapper identifies the influencer, and the Instagram scraper agent pulls their social data — including ad history — at scale.

Phase two fans out into parallel research. A product identifier prices items, while affiliate mappers, barter investigators, and donation mappers each handle their speciality — all running simultaneously through a split-join pattern.

Phase three is the risk assessor. It analyses all previous findings without using any search tools — purely reasoning over what the other agents have already discovered.

Phase four is where it gets really interesting. A follow-up planner creates a JSON task plan, and a dynamic parallel research executor spawns workers on demand — Worker 1 through Worker N — each verifying different aspects of the case.

And finally, phase five. The report synthesiser produces a complete Swedish compliance report, with a callback that replaces all internal citations with properly verified references.

What used to take analysts days to compile now happens in minutes.
`.trim();

async function main() {
  console.log("Generating narration with Gemini 2.5 Flash TTS...");

  const { media } = await ai.generate({
    model: googleAI.model("gemini-2.5-flash-preview-tts"),
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Algenib" },
        },
      },
    },
    prompt: NARRATION_TEXT,
  });

  if (!media?.url) {
    throw new Error("No audio returned from Gemini TTS");
  }

  // The response is a base64 data URI — extract the raw PCM
  const base64 = media.url.substring(media.url.indexOf(",") + 1);
  const pcmBuffer = Buffer.from(base64, "base64");

  // Wrap in WAV container (Gemini TTS returns 24kHz 16-bit mono PCM)
  const wavBuffer = createWav(pcmBuffer, 1, 24000, 16);

  const outDir = path.resolve(__dirname, "..", "public", "audio");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "blueprint-narration.mp3");

  // Save as .wav first (rename to .mp3 is fine for <audio> — browsers
  // detect format by header, not extension). For a true MP3, run:
  //   ffmpeg -i blueprint-narration.mp3 -codec:a libmp3lame -qscale:a 2 out.mp3
  // and replace the file.
  fs.writeFileSync(outPath, wavBuffer);

  console.log(`Written ${wavBuffer.length} bytes to ${outPath}`);
  console.log("Done! The file is ready for stage playback.");
}

function createWav(pcm: Buffer, channels: number, sampleRate: number, bitDepth: number): Buffer {
  const byteRate = sampleRate * channels * (bitDepth / 8);
  const blockAlign = channels * (bitDepth / 8);
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
