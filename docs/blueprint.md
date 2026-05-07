# **App Name**: NarrativeFlow

## Core Features:

- **Single-page scroll presentation**: One Next.js route (`src/app/page.tsx`) renders a full-height scroll container (`main.snap-container`) with **CSS scroll snapping** (`scroll-snap-type: y mandatory` on the container; each slide is a `100vh` `.snap-section` with `scroll-snap-align: start`).
- **Eight cinematic chapters**: Fixed titles—Prologue, The Vision, The Swarm, The Pedagogy, The Automation, The Verdict, The Wisdom, The Future—each mapped to **one local full-screen background video** (eight MP4s under `/videos/…`, unchanged paths).
- **Video backgrounds**: Each slide uses `<video>` with `muted`, `playsInline`, `loop`, and `preload="metadata"`, `object-cover`, and a slow **transform-only** zoom on the active slide. **Only the slide that is sufficiently in view plays**; others are **paused** via `IntersectionObserver` (root = the scroll container) to limit decode/CPU use. Until the video has data, a **Next.js `Image` placeholder** (from `placeholder-images`) is shown.
- **Text and motion**: Slide copy is centered; staggered **opacity / transform** fade-ins are driven by a **`section-visible` class** when the section crosses an intersection threshold (no scroll-driven layout JS for the main story).
- **HUD**: Fixed header with current chapter label, **linear progress** across all slides, a **15-minute session timer** (pause/resume), and a **BETA 1.0** badge. The HUD **fades out after mouse idle** (~5s) and when a deep-dive overlay is open.
- **Chapter navigation**: Fixed **vertical timeline** on the left; buttons **smooth-scroll** to the matching slide (`scrollTo` by viewport height).
- **“The Swarm” slide interactions**: Optional **Technical Swarm Blueprint** opens a full-screen overlay; **narration** is generated with **`generateAssistantSpeech`** (Genkit TTS flow) and played through a hidden `<audio>` element. A small **evidence** card can appear after a timed delay while that chapter is active.
- **Polish**: Subtle **film-grain** overlay; gradient over videos (`from-black/70` → `to-black/90`) for readability.

## Style Guidelines:

- **Theme**: Dark, presentation-first UI using shared **CSS variables** in `globals.css` (HSL tokens consumed by Tailwind), not one-off hex in components.
- **Background**: Deep blue-gray (`--background`: `240 20% 10%`) for page/scene base.
- **Primary / emphasis**: Muted indigo-violet (`--primary`: `240 38% 29%`) for primary UI emphasis.
- **Accent**: Cool cyan/sky (`--accent`: `196 53% 60%`) for highlights, borders, and key phrases—aligned with `ring` and focus styling.
- **Over video**: Vertical **gradient** plus dark areas so white and accent text stay legible; selection uses `accent` at low opacity.
- **Typography**: **Inter** (loaded in `layout.tsx`, `font-body` / variable) for headings and body in the presentation.
- **Slides**: Each section is **full viewport height**; main content is **centered** in a constrained container; immersive full-bleed video behind UI layers (`z-index` stacking: video → gradient → content → HUD/navigation).
