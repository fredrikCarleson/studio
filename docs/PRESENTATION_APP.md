# NarrativeFlow — Presentation App Overview

**NarrativeFlow** is a cinematic, scroll-snapping presentation web application built for Fredrik Carleson's keynote address at the **Google Cloud Summit Nordics 2026** (*Exclusive Executive Breakfast, Public Sector*).

The presentation recounts the story of a 48-hour hackathon at Google's Stockholm office, where three teams from the **Swedish Tax Agency (*Skatteverket*)** explored whether multi-agent AI systems could solve real-world tax administration and compliance problems.

---

## 1. Core Architecture & Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | Framework with Turbopack for fast live development and production bundling. |
| **React 19 & TypeScript** | Component model, strict type-checking, and state management. |
| **Tailwind CSS & CSS Variables** | Dark presentation color system (`--background`, `--primary`, `--accent`, `--card`) with custom film grain and scrim overlays. |
| **Radix UI & Lucide Icons** | Accessible primitives (Progress bar, Dialog, Accordion) and vector iconography. |
| **Google Genkit** (`@genkit-ai/google-genai`) | Server-side AI flow orchestration and text-to-speech fallback (`tts-flow.ts`). |
| **HTML5 Video & IntersectionObserver** | Full-bleed background video decoding optimized for stage hardware. |

---

## 2. Narrative Structure: The 10 Chapters

The application consists of 10 full-screen (`100vh`) slides with CSS vertical scroll snapping (`scroll-snap-type: y mandatory`):

```
┌──────────────────────────────────────────────────────────────┐
│ Chapter 1: Prologue          — Sunrise over Stockholm        │
│ Chapter 2: The Vision        — The Bold Mission              │
│ Chapter 3: The Swarm         — Team Alpha (Influencers)      │
│ Chapter 4: The Pedagogy      — Team Bravo (Skatti 2.0)       │
│ Chapter 5: The Automation    — Team Delta (Company Risk)     │
│ Chapter 6: The Verdict       — Key Takeaways & Lessons       │
│ Chapter 7: The Wisdom        — The Core Insight (Boundaries) │
│ Chapter 8: The Future        — Closing Reflections & Gibson  │
│ Chapter 9: Arbetssätt & Styrning — Flaskhalsen har flyttats  │
│ Chapter 10: Thank You        — The Calm Horizon              │
└──────────────────────────────────────────────────────────────┘
```

### Chapter Breakdown

1. **Prologue (`/videos/Sunrise_over_Stockholm_202604071643.mp4`)**
   - *Headline:* "Hackathon. Two days. Three teams. Fifteen brains."
   - *Subtitle:* Agentic AI · Swedish Tax Agency · Google.
   - Sets the scene of walking into Google's office on November 24th.

2. **The Vision (`/videos/Modern_tech_office_202604071647.mp4`)**
   - *Headline:* "The Bold Mission"
   - Poses the fundamental question: *Could we build solutions where multiple AI agents collaborate to solve real problems — in two days, without prior preparation?*
   - Explains that building multi-agent systems is about designing a team, not just writing software.

3. **The Swarm (`/videos/slide-3-the-swarm.mp4`) — Team Alpha (Winner)**
   - *Headline:* "The Influencer Swarm"
   - Highlights: 10,000+ Swedish influencers, 48h build, 5 collaborating agents:
     - *Social Media Scanner:* Collects posts and media across channels.
     - *Valuation Agent:* Identifies luxury items and calculates fair market value.
     - *Risk Profiler:* Maps corporate ties, trends, and synthesizes compliance profiles.
   - **Interactive Sub-step 1 (Evidence Card):** Pressing `→` or `Space` pops an evidence card with `influencerJail.png` (*"He went to jail. Our swarm could have nudged him months earlier"*).
   - **Interactive Technical Blueprint Overlay:** Pressing `B` opens a full-screen deep dive on the 5-phase swarm architecture (`flowInfluencer.png`), with an interactive push-to-talk voice prompt that triggers an AI narration (`blueprint-narration.mp3` or Genkit TTS) while synchronizing live SVG highlights over the 5 phases.

4. **The Pedagogy (`/videos/slide-4-the-knowledge-splitv2.mp4`) — Team Bravo**
   - *Headline:* "The Knowledge Split" (Skatti 2.0)
   - *The Surprise:* Fine-tuning the agent on the Swedish Tax Agency's official site resulted in *worse* answers than standard foundation models.
   - *The Insight:* Official documentation specifies **what** rules exist, but not **how** to solve practical cases. AI understands patterns rather than legal truth; guidance and pedagogy require verification.

5. **The Automation (`/videos/slide-5-the-automation.mp4`) — Team Delta**
   - *Headline:* "Risk Analysis Swarm"
   - Automates initial corporate risk assessments using annual reports, Statistics Sweden (SCB) data, and public registries.
   - *Speed Comparison:* **Days of manual analyst labor** vs. **Minutes of AI reasoning**.

6. **The Verdict (`/videos/slide-6-the-verdict.mp4`)**
   - *Headline:* "What we learned — Two days. Three teams."
   - Summarizes insights from Alpha (unstructured data), Bravo (what vs. how), and Delta (data gathering vs. analysis).
   - Core shift: *"Code is no longer the bottleneck — clarity of problem definition is."*

7. **The Wisdom (`/videos/slide-7-the-wisdom.mp4`)**
   - *Headline:* "The Core Insight"
   - *"Agents are all-knowing trainees with superpowers — fast and capable, but without judgment."*
   - What multi-agent teams require:
     1. **Boundaries:** Define what each agent can decide autonomously.
     2. **Orchestration:** Dictate who passes data to whom, and when.
     3. **Direction:** Set clear goals and provide space for learning.
   - *"Less software thinking · more design team thinking."*

8. **The Future (`/videos/slide-8-the-future.mp4`)**
   - *Headline:* "We walked in with questions. We walked out with answers."
   - Reflection: Speed is no longer the limit; knowing what is valuable is. The distance between idea and software has collapsed.
   - Closes with William Gibson's aphorism: *"The future is already here — it's just not evenly distributed."*

9. **Arbetssätt & Styrning (`/videos/slide-9-the-calm.mp4`)**
   - *Headline:* "Flaskhalsen har flyttats"
   - *Subtitle:* Ekonomin bakom utveckling har förändrats.
   - Interactive 5-step operational model:
     - *1. Paradigmskiftet:* När utveckling är dyrt vs när AI gör prototyping snabb och billig.
     - *2. De 4 Stadierna:* Labb $\rightarrow$ PoC $\rightarrow$ Pilot $\rightarrow$ Fullskala.
     - *3. Gradvis Styrning:* Styrningen ökar i takt med risk. "Det spelar ingen roll att prototypen tar 3 timmar om tillståndet tar 4 veckor."
     - *4. Portföljens Nya Roll:* Portföljen avgör inte vilka idéer som testas — utan vilka som ska skalas.
     - *5. Helhetsbilden:* 4 harmoniserade pelare med direktkopplad styrning och möjliggörande plattform/infrastruktur.

10. **Thank You (`/videos/slide-9-the-calm-2.mp4`)**
    - *Headline:* "Thank you"
    - Clean, impactful centered closing slide over tranquil calm horizon footage.

---

## 3. Interactive Stage Controls & Keyboard Shortcuts

| Shortcut | Action | Details |
| :--- | :--- | :--- |
| `→` / `Space` / `↓` | **Next Slide / Sub-step** | Advances sub-steps first (e.g. Swarm evidence modal), then smooth-scrolls to the next slide. |
| `←` / `↑` | **Previous Slide / Sub-step** | Steps back within a slide or scrolls to the prior chapter. |
| `B` | **Blueprint Overlay** | Toggles the 5-phase interactive Swarm architecture on Slide 3. |
| `H` | **Toggle HUD** | Toggles chapter title, progress bar, and session countdown timer. |
| `F` | **Fullscreen** | Toggles browser full-screen presentation mode. |
| `Esc` | **Close Overlays** | Closes Blueprint modal or shortcut cheatsheet. |
| `?` or `/` | **Shortcut Help** | Shows the on-screen keyboard shortcut modal. |

---

## 4. Key Components & Implementation Details

### `src/components/PresentationSection.tsx`
- Encapsulates every slide.
- Manages an `IntersectionObserver` attached to `scrollRootRef` (the snap container).
- Plays background video only when `intersectionRatio >= 0.6`. Pauses otherwise to conserve GPU decode cycles.
- Renders placeholder images (`next/image`) with low-opacity grayscale fallback until `onLoadedData` fires.
- Applies dual scrim layers (gradient top/bottom + optional radial midground vignette) to guarantee WCAG-compliant contrast over moving footage.

### `src/app/page.tsx`
- **SessionTimer:** Self-contained 15-minute countdown clock (prevents re-renders of the rest of the tree). Turns red and pulses with 5 minutes remaining.
- **PresentationHUD:** Fixed header with current chapter count, progress indicator, and session timer. Auto-hides after 5 seconds of mouse inactivity.
- **NavigationTimeline:** Fixed vertical indicator on the left viewport margin for one-click smooth jumps.
- **Blueprint Voice & SVG Sync:** Uses `requestAnimationFrame` while audio plays to poll `audioRef.current.currentTime` against `PHASE_TIMESTAMPS`, lighting up the corresponding SVG bounding box (`PHASE_REGIONS`) over `flowInfluencer.png`.
- **LLM Voice Assistant Simulation (Push-to-Talk):** When holding and releasing the voice button, a deliberate `1600ms` delay (`BLUEPRINT_NARRATION_DELAY_MS`) triggers the UI state *"Assistant preparing response…"*. This intentionally mimics real-world conversational LLM processing latency (e.g., Grok / ChatGPT Voice / Gemini Live) while playing reliable pre-recorded stage audio to completely avoid the "demo devil" during live presentations.

### `src/ai/flows/tts-flow.ts`
- Genkit flow definition using `@genkit-ai/google-genai` and Gemini TTS.
- Serves as the dynamic speech synthesis fallback if the pre-recorded stage audio (`/audio/blueprint-narration.mp3`) is unavailable.

---

## 5. Development & Stage Run Commands

```bash
# Run local dev server with Turbopack on port 9002
npm run dev

# Run Genkit development environment (for testing AI TTS flows)
npm run genkit:dev

# Type-check TypeScript
npm run typecheck

# Build production bundle
npm run build
```
