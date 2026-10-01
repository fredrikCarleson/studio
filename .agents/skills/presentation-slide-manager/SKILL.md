---
name: presentation-slide-manager
description: >-
  Use this skill when adding, editing, reordering, or styling presentation slides (chapters),
  configuring background videos, adding interactive sub-steps, or creating slide overlays
  in the NarrativeFlow presentation app.
---

# Presentation Slide Manager

This skill provides step-by-step procedures and constraints for managing slides (chapters) in the **NarrativeFlow** presentation app.

## Architecture Overview

All slides live in [src/app/page.tsx](file:///c:/Antigravity/studio/src/app/page.tsx) inside a snap-scroll container (`main.snap-container` with `scroll-snap-type: y mandatory`). Each slide is an instance of `<PresentationSection>` (defined in [src/components/PresentationSection.tsx](file:///c:/Antigravity/studio/src/components/PresentationSection.tsx)).

---

## 1. Adding or Modifying a Chapter (Slide)

When adding or reordering a chapter, update these interconnected locations in [src/app/page.tsx](file:///c:/Antigravity/studio/src/app/page.tsx):

### Step 1: Update the `CHAPTERS` Array
Add the chapter title in presentation order:
```typescript
const CHAPTERS = [
  "Prologue",
  "The Vision",
  "The Swarm",
  // ... add or edit chapter name here
] as const;
```
*Note: The HUD and vertical `NavigationTimeline` automatically read from `CHAPTERS`.*

### Step 2: Update the `LOCAL_VIDEOS` Array
Add the corresponding local video path matching the chapter's index:
```typescript
const LOCAL_VIDEOS = [
  "/videos/Sunrise_over_Stockholm_202604071643.mp4",
  // ... video path at matching index
] as const;
```
Ensure video files are placed in `/public/videos/` and are H.264 MP4 format.

### Step 3: Implement the `<PresentationSection>`
Insert the slide markup in the correct order inside `<main>`:
```tsx
<PresentationSection
  sectionIndex={N}
  chapterName="Chapter Title"
  scrollRootRef={containerRef}
  onSectionActiveChange={handleSectionActiveChange}
  videoUrl={LOCAL_VIDEOS[N]}
  fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "...")?.imageUrl ?? ""}
  contentClassName="space-y-8 w-full max-w-5xl mx-auto pt-14"
  overlayGradientClassName="from-black/90 via-black/50 to-black/92"
  videoLoadedOpacityClassName="opacity-[0.55]"
  midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_70%_at_50%_45%,rgba(0,0,0,0.52),transparent_72%)]"
>
  {/* Slide header, content cards, statistics */}
</PresentationSection>
```

---

## 2. Background Video & Readability Rules

To maintain 60 FPS performance and stage readability across high-res displays:

1. **Decoder Optimization:** `PresentationSection` uses an `IntersectionObserver` with an active threshold of `0.6`. Only the active slide plays; non-visible slides pause automatically.
2. **Text Contrast Scrims:** Always tune contrast using:
   - `overlayGradientClassName`: Top-to-bottom scrim (e.g., `from-black/92 via-black/55 to-black/94`).
   - `videoLoadedOpacityClassName`: Controls video brightness (typically `opacity-[0.45]` to `opacity-[0.60]`).
   - `midgroundOverlayClassName`: Radial vignette to darken video centers behind text.
   - Text drop shadows: Use Tailwind utility classes like `[text-shadow:0_2px_16px_rgba(0,0,0,0.9)]` on headers.

---

## 3. Adding Interactive Sub-Steps to a Slide

Sub-steps allow pressing `→` or `Space` to reveal progressive content (e.g., evidence cards, secondary charts) before advancing to the next slide.

1. **Register the slide index and extra step count in `SLIDE_SUB_STEPS`:**
   ```typescript
   const SLIDE_SUB_STEPS: Record<number, number> = {
     2: 1, // Slide index 2 has 1 extra step (step 0 = main content, step 1 = evidence)
   };
   ```
2. **Conditionally render or animate content based on `subStep`:**
   ```typescript
   const showMyExtraContent = currentIndex === 2 && subStep >= 1;
   ```

---

## 4. Overlay Placement Rule (CRITICAL)

> [!IMPORTANT]
> **All modal overlays, lightboxes, and deep-dive dialogs MUST be rendered OUTSIDE `<main>`.**
> 
> Because `<main>` is a CSS snap-scroll container with transforms and overflow styling, rendering fixed overlays inside `<main>` causes positioning glitches, transform clipping, and z-index stacking context bugs in Chrome and Safari.
> 
> Always render overlays right before the closing `<>` tag in `src/app/page.tsx`.
