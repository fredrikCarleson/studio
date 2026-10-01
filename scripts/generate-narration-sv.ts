/**
 * Generate the Swedish blueprint narration MP3 using Gemini 2.5 Flash TTS.
 *
 * Usage:
 *   npx tsx scripts/generate-narration-sv.ts [GEMINI_API_KEY]
 *
 * Prerequisites:
 *   - GEMINI_API_KEY or GOOGLE_API_KEY env var (or pass as first CLI argument)
 *   - Or place in .env / .env.local
 *
 * Output:
 *   public/audio/blueprint-narration-sv.mp3
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

// Allow passing key as command-line arg if not in env
const cliKey = process.argv[2];
if (cliKey && !cliKey.startsWith("-")) {
  process.env.GEMINI_API_KEY = cliKey;
  process.env.GOOGLE_GENAI_API_KEY = cliKey;
}

import { ai } from "../src/ai/genkit";
import { googleAI } from "@genkit-ai/google-genai";

const NARRATION_TEXT_SV = `
Hej Fredrik. Självklart kan jag förklara diagrammet för dig.

Det här är den femfasiga svärmarkitektur som vi byggde under hackathonet.

Fas ett inleds med datainsamling i stor skala. Kanal-analytikern identifierar influencern, och Instagram-scrapern samlar in publik social data och annonshistorik i hög hastighet.

Fas två grenar ut i parallell research. En värderingsagent prissätter produkter, medan agenter för affiliates, byteshandel och gåvor analyserar flödet parallellt genom ett split-join-mönster.

Fas tre är riskbedömningen. Den analyserar alla samlade fynd helt utan sökverktyg — ren slutledningsförmåga över vad de andra agenterna upptäckt.

I fas fyra blir det riktigt intressant. En uppföljande planerare skapar en JSON-uppgiftsplan, och den dynamiska forskningsmotorn startar upp specialiserade agenter efter behov — Worker 1 till Worker N.

Och slutligen, fas fem. Rapportsyntetiseraren skapar en komplett svensk revisionsrapport, med verifierade källhänvisningar.

Det som tidigare tog utredare flera dagar sker nu på några få minuter.
`.trim();

async function main() {
  console.log("Genererar svensk narration med Gemini 2.5 Flash TTS (röst: Algenib)...");

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
    prompt: NARRATION_TEXT_SV,
  });

  if (!media?.url) {
    throw new Error("Inget ljud returnerades från Gemini TTS");
  }

  // The response is a base64 data URI — extract the raw PCM
  const base64 = media.url.substring(media.url.indexOf(",") + 1);
  const pcmBuffer = Buffer.from(base64, "base64");

  // Wrap in WAV container (Gemini TTS returns 24kHz 16-bit mono PCM)
  const wavBuffer = createWav(pcmBuffer, 1, 24000, 16);

  const outDir = path.resolve(__dirname, "..", "public", "audio");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "blueprint-narration-sv.mp3");

  fs.writeFileSync(outPath, wavBuffer);

  const durationSec = pcmBuffer.length / (24000 * 2);
  console.log(`Skriven till: ${outPath} (${wavBuffer.length} bytes, ca ${Math.round(durationSec)} sekunder)`);
  console.log("Klart! Filen är redo för scenvisning.");
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
  console.error("Fel vid generering:", err);
  process.exit(1);
});
