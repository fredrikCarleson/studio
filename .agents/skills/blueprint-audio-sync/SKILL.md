---
name: blueprint-audio-sync
description: >-
  Use this skill when updating, re-generating, or synchronizing the Technical Blueprint audio
  narration, Genkit TTS flows, or SVG phase highlight coordinates in the NarrativeFlow presentation app.
---

# Blueprint Audio & SVG Synchronization

This skill outlines how to maintain and update the interactive **Technical Swarm Blueprint** overlay on Slide 3 (The Swarm).

## Component Overview

The blueprint overlay consists of:
1. **Narration Audio:** Primary audio file located at [public/audio/blueprint-narration.mp3](file:///c:/Antigravity/studio/public/audio/blueprint-narration.mp3).
2. **Genkit TTS Fallback:** Defined in [src/ai/flows/tts-flow.ts](file:///c:/Antigravity/studio/src/ai/flows/tts-flow.ts), called dynamically if the MP3 is missing.
3. **Phase Synchronization:** `requestAnimationFrame` polling `audio.currentTime` against `PHASE_TIMESTAMPS` in [src/app/page.tsx](file:///c:/Antigravity/studio/src/app/page.tsx).
4. **SVG Highlight Overlay:** An SVG with `viewBox="0 0 1918 1078"` placed directly over `/images/flowInfluencer.png`.

---

## 1. Updating Phase Timestamps

If the audio narration MP3 is re-recorded or updated, update the second boundaries in `PHASE_TIMESTAMPS` in [src/app/page.tsx](file:///c:/Antigravity/studio/src/app/page.tsx):

```typescript
const PHASE_TIMESTAMPS: { start: number; end: number }[] = [
  { start: 8,  end: 19 }, // Phase 1 — Data Gathering
  { start: 19, end: 32 }, // Phase 2 — Parallel Research
  { start: 32, end: 42 }, // Phase 3 — Risk Assessment
  { start: 42, end: 57 }, // Phase 4 — Follow-up Investigation
  { start: 57, end: 69 }, // Phase 5 — Compliance Report
];
```

*Tip: Listen to the audio with an audio player (or inspect `audio.currentTime` in devtools) to note the exact timestamps where the speaker introduces each phase.*

---

## 2. Mapping SVG Highlight Bounding Boxes (`PHASE_REGIONS`)

The diagram image `flowInfluencer.png` has a natural resolution of **1918 × 1078 px**.

Both `<img className="... object-contain" />` and `<svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 1918 1078">` share the identical aspect ratio scaling logic. Therefore, coordinates in `PHASE_REGIONS` map 1:1 to image pixels:

```typescript
const PHASE_REGIONS: { x: number; y: number; w: number; h: number }[] = [
  { x: 5,    y: 5,   w: 620, h: 360 }, // Phase 1 — Data Gathering
  { x: 610,  y: 68,  w: 725, h: 385 }, // Phase 2 — Parallel Research
  { x: 1345, y: 255, w: 570, h: 175 }, // Phase 3 — Risk Assessment
  { x: 975,  y: 505, w: 940, h: 320 }, // Phase 4 — Follow-up Investigator
  { x: 975,  y: 845, w: 940, h: 215 }, // Phase 5 — Compliance Report
];
```

### Adjusting Coordinates:
If you update or replace `flowInfluencer.png`:
1. Check the image's intrinsic pixel width and height.
2. Update the SVG `viewBox="0 0 [width] [height]"`.
3. Measure the `{ x, y, width, height }` bounds of each section in image-pixel space.

---

## 3. Push-to-Talk Simulation & Timing

In stage demonstrations, the assistant responds after releasing the push-to-talk button:

- `BLUEPRINT_NARRATION_DELAY_MS = 1600;`: Simulates agent thinking time between button release and speech starting.
- Pointer events (`onPointerDown`, `onPointerUp`) capture pointer IDs so touch and mouse releases reliably trigger even if dragged slightly.
- Pressing `Esc` or clicking the close button immediately pauses `audioRef` and resets all timers and phase highlights.

---

## 4. Testing the TTS Flow Locally

To test or update the Genkit TTS flow:
```bash
# Start Genkit developer UI and watch flow changes
npm run genkit:dev
```
Then invoke the `generateAssistantSpeech` flow with sample text to inspect audio synthesis.
