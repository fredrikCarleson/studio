---
name: presentation-stage-validator
description: >-
  Use this skill when testing, dry-running, or validating the NarrativeFlow presentation app
  before a rehearsal, live stage event, or demo to verify media assets, build health, and keyboard controls.
---

# Presentation Stage Validator

This skill provides a pre-stage validation runbook to ensure the **NarrativeFlow** presentation app runs flawlessly under conference/stage conditions.

## Pre-Flight Checklist

Execute these 4 steps in order before running a rehearsal or live demo.

---

### Step 1: Verify All Stage Media Assets
Run the asset validation script to confirm all 8 background MP4 videos, narration audio, and diagram images are present and uncorrupted:

```bash
node .agents/skills/presentation-stage-validator/scripts/validate-assets.mjs
```

Expected output:
- All 8 chapter videos found under `/public/videos/`.
- `blueprint-narration.mp3` found under `/public/audio/`.
- `flowInfluencer.png` and `influencerJail.png` found under `/public/images/`.

---

### Step 2: TypeScript & Build Sanity Check

Run type-checking to ensure no broken imports or type mismatches:
```bash
npm run typecheck
```

Validate production bundle compilation:
```bash
npm run build
```

---

### Step 3: Local Dev Server Startup

Start the presentation app on the standard presentation port:
```bash
npm run dev
```
Open `http://localhost:9002` in Chrome.

---

### Step 4: Rehearsal & Keyboard Sanity Runbook

Perform this quick manual walkthrough:
1. **Fullscreen:** Press `F` to verify full-screen toggle works without layout distortion.
2. **Slide Snapping:** Press `Space` or `→` through all 8 chapters:
   - Ensure the left `NavigationTimeline` updates correctly.
   - Verify video playback initiates smoothly when entering each slide and pauses when leaving.
3. **Slide 3 Sub-Step:** On Chapter 3 ("The Swarm"), press `→` to reveal the evidence card ("He went to jail").
4. **Slide 3 Blueprint:** Press `B` to open the Swarm Architecture overlay:
   - Click and hold the push-to-talk button (`Hold — address the assistant`).
   - Release the button; verify the narration starts after ~1.6s delay.
   - Check that SVG phase regions 1 through 5 highlight in sync with the audio.
   - Press `Esc` to close overlay.
5. **HUD Timer:** Check the top-right session timer:
   - Verify pause/play toggle works.
   - Wait 5 seconds without moving the mouse to confirm HUD fades out automatically.
   - Move mouse to confirm HUD reappears.
