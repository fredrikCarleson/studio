"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import type { PointerEvent } from "react";
import {
  Cpu,
  MessageSquare,
  Workflow,
  Users,
  AlertTriangle,
  FileText,
  Database,
  Clock,
  X,
  Info,
  Volume2,
  Sparkles,
  Rocket,
  ArrowRight,
  Keyboard,
  ShieldCheck,
  Compass,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ??? Narrative Structure ???????????????????????????????????????????????????????

const CHAPTERS = [
  "Prologue",
  "The Vision",
  "The Swarm",
  "The Pedagogy",
  "The Automation",
  "The Verdict",
  "The Wisdom",
  "The Future",
] as const;

const LOCAL_VIDEOS = [
  "/videos/Sunrise_over_Stockholm_202604071643.mp4",          // 1 ? Prologue
  "/videos/Modern_tech_office_202604071647.mp4",               // 2 ? The Vision
  "/videos/slide-3-the-swarm.mp4",                             // 3 ? The Swarm
  "/videos/slide-4-the-knowledge-splitv2.mp4",                  // 4 ? The Pedagogy
  "/videos/slide-5-the-automation.mp4",                        // 5 ? The Automation
  "/videos/slide-6-the-verdict.mp4",                           // 6 ? The Verdict
  "/videos/slide-7-the-wisdom.mp4",                            // 7 ? The Wisdom
  "/videos/slide-8-the-future.mp4",                            // 8 - The Future
] as const;

/**
 * Pre-generated MP3 for bulletproof stage playback.
 * Falls back to live TTS only if this file is missing.
 */
const BLUEPRINT_AUDIO_URL = "/audio/blueprint-narration.mp3";

/** Simulated ?agent thinks, then replies? after you release push-to-talk */
const BLUEPRINT_NARRATION_DELAY_MS = 1600;
/**
 * When each phase is discussed in the blueprint narration MP3 (seconds).
 * Adjust if audio is re-generated.
 */
const PHASE_TIMESTAMPS: { start: number; end: number }[] = [
  { start: 8,  end: 19 }, // Phase 1 ? Data Gathering
  { start: 19, end: 32 }, // Phase 2 ? Parallel Research
  { start: 32, end: 42 }, // Phase 3 ? Risk Assessment
  { start: 42, end: 57 }, // Phase 4 ? Follow-up Investigation
  { start: 57, end: 69 }, // Phase 5 ? Compliance Report
];

/**
 * Phase highlight bounding boxes in the flowInfluencer.png natural coordinate
 * space (1918 x 1078 px).
 */
const PHASE_REGIONS: { x: number; y: number; w: number; h: number }[] = [
  { x: 5,    y: 5,   w: 630,  h: 680 }, // Phase 1 ? Initial Data Gathering
  { x: 445,  y: 5,   w: 975,  h: 590 }, // Phase 2 ? Parallel Research
  { x: 1345, y: 245, w: 570,  h: 390 }, // Phase 3 ? Risk Assessment
  { x: 445,  y: 590, w: 1470, h: 385 }, // Phase 4 ? Follow-up Investigator
  { x: 690,  y: 835, w: 1225, h: 240 }, // Phase 5 ? Compliance Report
];

/**
 * Slides with sub-steps: pressing "next" cycles through sub-steps
 * before advancing to the next slide. value = number of extra steps.
 * Slide 3 (index 2): step 0 = slide content, step 1 = evidence card.
 */
const SLIDE_SUB_STEPS: Record<number, number> = {
  2: 1,
};

// ??? Keyboard Reference ????????????????????????????????????????????????????????

const KEYS = [
  { key: "\u2192 / Space", action: "Next slide / sub-step" },
  { key: "\u2190", action: "Previous slide" },
  { key: "B", action: "Blueprint overlay (Slide 3)" },
  { key: "H", action: "Toggle HUD" },
  { key: "F", action: "Fullscreen" },
  { key: "Esc", action: "Close overlay" },
  { key: "?", action: "This reference" },
];

// ??? SessionTimer (isolated to avoid full-page re-renders on tick) ?????????????

const SessionTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState(900);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatted = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const isUrgent = timeLeft < 300;

  const handleReset = useCallback(() => {
    setTimeLeft(900);
    setIsRunning(false);
  }, []);

  return (
    <div className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-3 bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
      <div
        className="flex flex-col items-end border-r border-white/10 pr-4 md:pr-5 cursor-pointer select-none"
        onDoubleClick={handleReset}
        title="Double-click to reset (15m)"
      >
        <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">
          Session Timer
        </span>
        <span
          className={cn(
            "font-mono text-xl md:text-2xl font-light tracking-tighter",
            isUrgent ? "text-red-500 animate-pulse" : "text-white"
          )}
        >
          {formatted}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center border border-white/10 text-white/40 hover:text-accent hover:border-accent/40 transition-colors duration-200 rounded-sm text-sm font-mono cursor-pointer"
          aria-label={isRunning ? "Pause timer" : "Resume timer"}
        >
          {isRunning ? "\u23F8" : "\u25B6"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          title="Reset timer to 15:00"
          className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center border border-white/10 text-white/25 hover:text-white hover:border-white/30 transition-colors duration-200 rounded-sm text-xs font-mono cursor-pointer"
          aria-label="Reset timer to 15:00"
        >
          {"\u21BA"}
        </button>
      </div>
    </div>
  );
});
SessionTimer.displayName = "SessionTimer";

// ??? HUD ??????????????????????????????????????????????????????????????????????

type HUDProps = {
  currentIndex: number;
  progressValue: number;
  isHidden: boolean;
  onToggleKeyboard: () => void;
};

const PresentationHUD = memo(({ currentIndex, progressValue, isHidden, onToggleKeyboard }: HUDProps) => (
  <div
    className={cn(
      "fixed top-0 left-0 w-full z-[80] p-8 flex justify-between items-start transition-[opacity,transform] duration-500 ease-out",
      isHidden ? "opacity-0 pointer-events-none -translate-y-3" : "opacity-100 translate-y-0"
    )}
  >
    <div className="flex flex-col gap-2 w-64">
      <div className="flex flex-col mb-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-accent/50">
          Chapter {currentIndex + 1} of {CHAPTERS.length}
        </span>
        <span className="text-sm font-bold tracking-tight text-white uppercase">
          {CHAPTERS[currentIndex]}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Progress
          value={progressValue}
          className="h-[1px] bg-white/10 flex-1"
          aria-label="Presentation progress"
        />
        <span className="text-[9px] font-mono text-white/25 shrink-0 w-8 text-right">
          {Math.round(progressValue)}%
        </span>
      </div>
    </div>

    <div className="flex flex-col items-end gap-3">
      <SessionTimer />
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-accent/10 border border-accent/30">
          <span className="text-[9px] font-bold tracking-[0.5em] text-accent uppercase">
            BETA 1.0
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleKeyboard}
          className="px-3 py-1 bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle keyboard shortcuts"
        >
          <span className="text-[9px] font-mono text-white/35 hover:text-accent uppercase tracking-widest">
            [?] Keys
          </span>
        </button>
      </div>
    </div>
  </div>
));
PresentationHUD.displayName = "PresentationHUD";

// ??? Navigation Timeline ??????????????????????????????????????????????????????

type NavProps = {
  currentIndex: number;
  scrollToSection: (i: number) => void;
  isHidden: boolean;
};

const NavigationTimeline = memo(({ currentIndex, scrollToSection, isHidden }: NavProps) => (
  <nav
    className={cn(
      "fixed left-10 top-1/2 -translate-y-1/2 z-[80] flex flex-col gap-8 transition-[opacity,transform] duration-500 ease-out",
      isHidden ? "opacity-0 pointer-events-none -translate-x-6" : "opacity-100 translate-x-0"
    )}
    aria-label="Slide navigation"
  >
    {CHAPTERS.map((name, i) => (
      <button
        key={i}
        type="button"
        onClick={() => scrollToSection(i)}
        className="group relative flex items-center"
        aria-label={`Go to ${name}`}
        aria-current={currentIndex === i ? "step" : undefined}
      >
        <div
          className={cn(
            "h-10 w-px origin-bottom transition-[transform,opacity,background-color] duration-500 ease-out",
            currentIndex === i
              ? "scale-y-100 bg-accent"
              : "scale-y-50 bg-white/10 group-hover:bg-white/30"
          )}
        />
        <div
          className={cn(
            "absolute left-4 px-2 py-1 transition-[opacity,transform] duration-300 ease-out",
            currentIndex === i
              ? "opacity-100 translate-x-0 border-l-2 border-accent"
              : "opacity-0 -translate-x-3 pointer-events-none"
          )}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-accent whitespace-nowrap font-bold">
            {name}
          </span>
        </div>
      </button>
    ))}
  </nav>
));
NavigationTimeline.displayName = "NavigationTimeline";

// ??? Keyboard Reference Overlay ???????????????????????????????????????????????

const KeyboardReference = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <div
    className={cn(
      "fixed bottom-12 right-12 z-[90] bg-black/90 backdrop-blur-xl border border-white/10 p-6 w-72 shadow-2xl transition-[opacity,transform] duration-300 ease-out",
      isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
    )}
    role="dialog"
    aria-label="Keyboard shortcuts"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Keyboard className="h-3 w-3 text-accent" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent">
          Keyboard Shortcuts
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-white/30 hover:text-white transition-colors"
        aria-label="Close shortcuts"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
    <div className="space-y-2">
      {KEYS.map(({ key, action }, i) => (
        <div key={i} className="flex justify-between items-center">
          <kbd className="px-2 py-0.5 bg-white/10 border border-white/10 font-mono text-[10px] text-white/70">
            {key}
          </kbd>
          <span className="text-[10px] text-white/40">{action}</span>
        </div>
      ))}
    </div>
  </div>
));
KeyboardReference.displayName = "KeyboardReference";

// ??? Main Presentation Component ?????????????????????????????????????????????

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [isDeepDiveActive, setIsDeepDiveActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPushToTalkPressed, setIsPushToTalkPressed] = useState(false);
  const [isNarrationPending, setIsNarrationPending] = useState(false);
  const [activePhase, setActivePhase] = useState(-1);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const uiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const narrationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isDeepDiveActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    isDeepDiveActiveRef.current = isDeepDiveActive;
  }, [isDeepDiveActive]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Evidence card is driven by subStep, not a timer
  const showEvidence = currentIndex === 2 && subStep >= 1 && !isDeepDiveActive;

  // ?? Navigation with sub-step awareness ??????????????????????????????????????

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= CHAPTERS.length) return;
    const container = containerRef.current;
    if (container) {
      const sections = container.querySelectorAll<HTMLElement>(".snap-section");
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: "smooth" });
      } else {
        container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
      }
    }
  }, []);

  const advanceForward = useCallback(() => {
    const maxSub = SLIDE_SUB_STEPS[currentIndex] ?? 0;
    if (subStep < maxSub) {
      setSubStep((s) => s + 1);
    } else {
      if (currentIndex < CHAPTERS.length - 1) {
        scrollToSection(currentIndex + 1);
      }
    }
  }, [currentIndex, subStep, scrollToSection]);

  const goBack = useCallback(() => {
    if (subStep > 0) {
      setSubStep((s) => s - 1);
    } else if (currentIndex > 0) {
      scrollToSection(currentIndex - 1);
    }
  }, [currentIndex, subStep, scrollToSection]);

  const handleSectionActiveChange = useCallback((index: number, active: boolean) => {
    if (active) {
      if (narrationDelayRef.current) {
        clearTimeout(narrationDelayRef.current);
        narrationDelayRef.current = null;
      }
      setCurrentIndex(index);
      setSubStep(0);
      setIsNarrationPending(false);
      setIsPushToTalkPressed(false);
      setIsDeepDiveActive(false);
      setIsSpeaking(false);
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    }
  }, []);

  // ?? Deep Dive ? overlay opens silent; narration runs after push-to-talk release ?

  const clearNarrationDelay = useCallback(() => {
    if (narrationDelayRef.current) {
      clearTimeout(narrationDelayRef.current);
      narrationDelayRef.current = null;
    }
  }, []);

  const playBlueprintNarration = useCallback(async () => {
    if (!isDeepDiveActiveRef.current) return;

    const audio = audioRef.current;
    if (!audio) {
      setIsSpeaking(false);
      return;
    }

    setIsNarrationPending(false);
    setIsSpeaking(true);

    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);

    audio.src = BLUEPRINT_AUDIO_URL;
    try {
      await audio.play();
    } catch {
      try {
        const { generateAssistantSpeech } = await import("@/ai/flows/tts-flow");
        const NARRATION =
          "Hi Fredrik. Of course I can explain the diagram for you. " +
          "This is the five-phase swarm architecture we built during the hackathon. " +
          "Phase one starts with a parallel multi-modal scraper \u2014 the channel mapper and Instagram scraper agent pull social data at scale. " +
          "Phase two fans out into parallel research. A product identifier prices items, while affiliate mappers, barter investigators, and donation mappers each handle their speciality \u2014 all running simultaneously. " +
          "Phase three is the risk assessor. It analyses all previous findings without any search tools, purely reasoning over what the other agents discovered. " +
          "Phase four is where it gets interesting. A follow-up planner creates a JSON task plan, and a dynamic parallel research executor spawns Worker 1 through Worker N on demand. " +
          "And finally, phase five \u2014 the report synthesizer produces a complete Swedish compliance report with proper citations. " +
          "What used to take analysts days now happens in minutes.";
        const response = await generateAssistantSpeech({ text: NARRATION });
        audio.src = response.mediaUrl;
        await audio.play();
      } catch {
        setIsSpeaking(false);
      }
    }
  }, []);

  const openBlueprintOverlay = useCallback(() => {
    clearNarrationDelay();
    setIsNarrationPending(false);
    setIsPushToTalkPressed(false);
    setIsSpeaking(false);
    setIsDeepDiveActive(true);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [clearNarrationDelay]);

  const scheduleNarrationAfterRelease = useCallback(() => {
    if (!isDeepDiveActiveRef.current || isSpeakingRef.current) return;
    clearNarrationDelay();
    setIsNarrationPending(true);
    narrationDelayRef.current = setTimeout(() => {
      narrationDelayRef.current = null;
      if (!isDeepDiveActiveRef.current) {
        setIsNarrationPending(false);
        return;
      }
      void playBlueprintNarration();
    }, BLUEPRINT_NARRATION_DELAY_MS);
  }, [clearNarrationDelay, playBlueprintNarration]);

  const handleCloseDeepDive = useCallback(() => {
    clearNarrationDelay();
    setIsDeepDiveActive(false);
    setIsSpeaking(false);
    setIsNarrationPending(false);
    setIsPushToTalkPressed(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [clearNarrationDelay]);

  const onPushToTalkPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture may fail for some pointer types */
      }
      clearNarrationDelay();
      setIsNarrationPending(false);
      setIsPushToTalkPressed(true);
    },
    [clearNarrationDelay]
  );

  const onPushToTalkPointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
      setIsPushToTalkPressed(false);
      scheduleNarrationAfterRelease();
    },
    [scheduleNarrationAfterRelease]
  );

  // ?? Blueprint phase sync ? polls audio.currentTime via rAF while speaking ????

  useEffect(() => {
    const audio = audioRef.current;
    if (!isSpeaking || !audio) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setActivePhase(-1);
      return;
    }

    const tick = () => {
      const t = audio.currentTime;
      let phase = -1;
      for (let i = 0; i < PHASE_TIMESTAMPS.length; i++) {
        if (t >= PHASE_TIMESTAMPS[i].start && t < PHASE_TIMESTAMPS[i].end) {
          phase = i;
          break;
        }
      }
      setActivePhase(phase);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isSpeaking]);

  // ?? Mouse-idle HUD auto-hide ?????????????????????????????????????????????????

  useEffect(() => {
    const onMove = () => {
      setIsUIHidden(false);
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
      uiTimerRef.current = setTimeout(() => setIsUIHidden(true), 5000);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    };
  }, []);

  // ?? Keyboard Stage Controls ??????????????????????????????????????????????????

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as Element)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          if (!isDeepDiveActive) advanceForward();
          break;

        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          if (!isDeepDiveActive) goBack();
          break;

        case "Escape":
          if (isDeepDiveActive) {
            handleCloseDeepDive();
          } else if (subStep > 0) {
            setSubStep(0);
          }
          if (showKeyboard) setShowKeyboard(false);
          break;

        case "b":
        case "B":
          if (isDeepDiveActive) {
            handleCloseDeepDive();
          } else if (currentIndex === 2) {
            setShowKeyboard(false);
            openBlueprintOverlay();
          }
          break;

        case "h":
        case "H":
          setIsUIHidden((prev) => !prev);
          break;

        case "f":
        case "F":
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;

        case "?":
        case "/":
          setShowKeyboard((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, subStep, isDeepDiveActive, showKeyboard, advanceForward, goBack, openBlueprintOverlay, handleCloseDeepDive]);

  // ?? Derived ???????????????????????????????????????????????????????????????????

  const progressValue = useMemo(
    () => ((currentIndex + 1) / CHAPTERS.length) * 100,
    [currentIndex]
  );

  const hudHidden = isUIHidden || isDeepDiveActive;

  // ?? Render ????????????????????????????????????????????????????????????????????

  return (
    <>
    <main
      ref={containerRef}
      className="snap-container relative bg-black selection:bg-accent/30"
      role="presentation"
    >
      <div className="film-grain" aria-hidden="true" />
      <audio ref={audioRef} hidden />

      <PresentationHUD
        currentIndex={currentIndex}
        progressValue={progressValue}
        isHidden={hudHidden}
        onToggleKeyboard={() => setShowKeyboard((prev) => !prev)}
      />

      <NavigationTimeline
        currentIndex={currentIndex}
        scrollToSection={scrollToSection}
        isHidden={hudHidden}
      />

      <KeyboardReference
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
      />

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 1 ? PROLOGUE
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={0}
        chapterName="Prologue"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[0]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "hero-bg")?.imageUrl ?? ""}
        priority
      >
        <h1 className="text-5xl md:text-[7.5rem] font-black tracking-tighter text-white max-w-5xl leading-[0.88] mb-8 [text-wrap:balance]">
          Hackathon.{" "}
          <span className="text-accent italic font-light">Two days.</span>
          <br />
          Three teams.
          <br />
          Fifteen brains.
        </h1>
        <p className="text-white/70 text-base md:text-lg font-mono tracking-[0.2em] uppercase [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
          Agentic AI · Swedish Tax Agency · Google
        </p>
      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 2 ? THE VISION
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={1}
        chapterName="The Vision"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[1]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "tax-agency-bg")?.imageUrl ?? ""}
        contentClassName="space-y-10"
        overlayGradientClassName="from-black/92 via-black/55 to-black/93"
        videoLoadedOpacityClassName="opacity-[0.58]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_72%_at_50%_48%,rgba(0,0,0,0.5),transparent_74%)]"
      >
        <div className="relative">
          <Cpu className="h-16 w-16 text-accent mx-auto [filter:drop-shadow(0_4px_20px_rgba(0,0,0,0.85))_drop-shadow(0_0_24px_hsl(var(--accent)/0.35))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_8px_40px_rgba(0,0,0,0.75)]">
          The Bold Mission
        </h2>
        <p className="text-xl md:text-3xl font-light text-white/90 max-w-4xl mx-auto leading-relaxed [text-wrap:balance] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_1px_2px_rgba(0,0,0,0.8)]">
          Could we build solutions where{" "}
          <span className="text-accent font-semibold italic [text-shadow:0_0_28px_hsl(var(--accent)/0.45),0_2px_14px_rgba(0,0,0,0.95)]">
            multiple AI agents collaborate
          </span>{" "}
          to solve real problems{"\u2014"}{" "}
          in just two days, without prior preparation?
        </p>
        <p className="mx-auto max-w-4xl text-xl md:text-3xl font-light italic leading-snug text-white/95 [text-wrap:balance] [text-shadow:0_2px_14px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.85)]">
          We weren{"\u2019"}t building for perfection. We were building to understand.
        </p>
      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 3 ? THE SWARM (Team Alpha)
          Sub-step 0: slide content stagger in
          Sub-step 1: evidence card slides in (press ? to reveal)
          Press B: Technical Blueprint overlay with narration
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={2}
        chapterName="The Swarm"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[2]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "agent-bg")?.imageUrl ?? ""}
        contentClassName="space-y-8 relative w-full pt-14"
        overlayGradientClassName="from-black/90 via-black/48 to-black/93"
        videoLoadedOpacityClassName="opacity-[0.45]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_65%_at_50%_34%,rgba(0,0,0,0.62),transparent_70%)]"
      >
        <header className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 text-accent text-base md:text-lg font-bold uppercase tracking-[0.14em] shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
            Case Study ? Team Alpha
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_8px_40px_rgba(0,0,0,0.75)]">
            The Influencer Swarm
          </h2>
        </header>

        <div className="flex items-center justify-center gap-12">
          <div className="text-center">
            <span className="block text-5xl font-black text-accent [text-shadow:0_2px_16px_rgba(0,0,0,0.95)]">
              10,000+
            </span>
            <span className="text-xs md:text-sm uppercase tracking-[0.14em] text-white/70 font-bold mt-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
              Influencers in Sweden
            </span>
          </div>
          <div className="w-px h-14 bg-white/10" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-5xl font-black text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.95)]">
              48h
            </span>
            <span className="text-xs md:text-sm uppercase tracking-[0.14em] text-white/70 font-bold mt-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
              Build Time
            </span>
          </div>
          <div className="w-px h-14 bg-white/10" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-5xl font-black text-accent [text-shadow:0_2px_16px_rgba(0,0,0,0.95)]">
              5
            </span>
            <span className="text-xs md:text-sm uppercase tracking-[0.14em] text-white/70 font-bold mt-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
              Agents in the Swarm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
          {[
            {
              title: "Social Media Scanner",
              desc: "Scans public social feeds across platforms to surface possible collaborations and gifted products.",
              accent: true,
            },
            {
              title: "Valuation Agent",
              desc: "Identifies visible luxury items and estimates their market value.",
              accent: false,
            },
            {
              title: "Risk Profiler",
              desc: "Turns the evidence into a risk report with recommended actions.",
              accent: false,
            },
          ].map((card) => (
            <div
              key={card.title}
              className={cn(
                "p-7 bg-black/40 backdrop-blur-sm border border-white/15 text-left shadow-[0_8px_32px_rgba(0,0,0,0.55)]",
                card.accent ? "border-t-accent border-t-2" : "border-t-white/25 border-t-2"
              )}
            >
              <h3 className="text-white font-bold mb-2 tracking-[0.12em] uppercase text-sm md:text-base [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]">
                {card.title}
              </h3>
              <p className="text-white/82 text-base md:text-lg leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={openBlueprintOverlay}
            className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
            aria-label="Open Technical Swarm Blueprint"
          >
            <Info className="mr-2 h-4 w-4" aria-hidden="true" />
            Technical Blueprint
          </Button>
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 font-mono text-[9px] text-white/20 tracking-widest">
            B
          </kbd>
        </div>
      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 4 ? THE PEDAGOGY (Team Bravo)
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={3}
        chapterName="The Pedagogy"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[3]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "bravo-bg")?.imageUrl ?? ""}
        contentClassName="space-y-5 md:space-y-6 w-full max-w-5xl mx-auto px-6 pt-10"
        overlayGradientClassName="from-black/94 via-black/60 to-black/94"
        videoLoadedOpacityClassName="opacity-[0.52]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_68%_at_50%_42%,rgba(0,0,0,0.56),transparent_72%)]"
      >
        <div className="space-y-2 text-center">
          <div className="inline-block px-4 py-1.5 bg-black/50 backdrop-blur-sm border border-white/15 text-accent text-sm md:text-base font-bold uppercase tracking-[0.16em] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            Case Study{"\u2014"} Team Bravo
          </div>
          <p className="text-base md:text-lg font-mono uppercase tracking-[0.12em] text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
            Skatti 2.0{"\u00b7"} Tax Information Service
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]">
            The Knowledge Split
          </h2>
        </div>

        <figure className="mx-auto flex w-full max-w-5xl flex-col items-center rounded-xl border border-accent/40 bg-black/60 px-7 py-6 text-center shadow-[0_16px_56px_rgba(0,0,0,0.55)] backdrop-blur-md md:px-14 md:py-8">
          <div className="w-full max-w-[34rem] md:max-w-[42rem] space-y-3">
            <figcaption className="text-base font-mono font-semibold uppercase tracking-[0.1em] text-accent [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] md:text-lg md:tracking-[0.12em]">
              Our Surprise
            </figcaption>
            <blockquote className="text-xl font-medium leading-snug text-white [text-wrap:balance] [text-shadow:0_2px_16px_rgba(0,0,0,0.9)] md:text-[1.5rem] md:leading-[1.3]">
              Specialization failed. The agent trained on official data was less accurate than the base model.
            </blockquote>
            <p className="text-base font-mono font-semibold uppercase tracking-[0.1em] text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] md:text-lg md:tracking-[0.12em]">
              The Lesson: AI understands patterns, not truth
            </p>
          </div>
        </figure>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-px bg-white/10 w-full rounded-lg md:rounded-none overflow-hidden md:overflow-visible">
          <div className="p-5 md:p-7 bg-black/60 backdrop-blur-md text-center border border-white/10 md:border-white/5 rounded-lg md:rounded-none flex flex-col">
            <span className="text-accent font-mono text-base md:text-lg uppercase tracking-[0.1em] mb-3 block font-bold [text-shadow:0_0_20px_hsl(var(--accent)/0.25)]">
              The Rigid &ldquo;What&rdquo;
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              Official Channels.
            </h3>
              <p className="text-white/90 text-lg md:text-xl leading-snug font-normal max-w-prose mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
              Official data defines the rules but lacks the &ldquo;how-to&rdquo; context required for the AI to provide expert precision in its answers.
            </p>
            <div className="mt-auto pt-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-green-500/15 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-base md:text-lg text-green-300 uppercase tracking-[0.1em] font-bold">
                  Rule-Based Knowledge.
                </span>
              </div>
            </div>
          </div>
          <div className="p-5 md:p-7 bg-black/60 backdrop-blur-md text-center relative overflow-hidden border border-white/10 md:border-white/5 rounded-lg md:rounded-none flex flex-col">
            <div className="absolute top-4 right-4">
              <AlertTriangle className="text-red-500 h-5 w-5 animate-pulse [filter:drop-shadow(0_0_8px_rgba(239,68,68,0.5))]" aria-hidden="true" />
            </div>
            <span className="text-accent font-mono text-base md:text-lg uppercase tracking-[0.1em] mb-3 block font-bold [text-shadow:0_0_20px_hsl(var(--accent)/0.25)]">
              The Messy &ldquo;How&rdquo;
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              Guidance &amp; Application.
            </h3>
              <p className="text-white/90 text-lg md:text-xl leading-snug font-normal max-w-prose mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
              Practical reasoning comes from the messy &ldquo;how-to&rdquo; found on the web. Without this pedagogical data, legal precision remains out of reach.
            </p>
            <div className="mt-auto pt-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-red-500/15 border border-red-500/30">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-base md:text-lg text-red-300 uppercase tracking-[0.1em] font-bold">
                  Always needs verification
                </span>
              </div>
            </div>
          </div>
        </div>

      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 5 ? THE AUTOMATION (Team Delta)
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={4}
        chapterName="The Automation"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[4]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "delta-bg")?.imageUrl ?? ""}
        contentClassName="space-y-10 w-full max-w-5xl mx-auto pt-14"
        overlayGradientClassName="from-black/92 via-black/55 to-black/94"
        videoLoadedOpacityClassName="opacity-[0.52]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_95%_70%_at_50%_42%,rgba(0,0,0,0.58),transparent_72%)]"
      >
        <div className="space-y-3">
          <div className="inline-block px-4 py-1.5 bg-black/50 backdrop-blur-sm border border-white/15 text-accent text-base md:text-lg font-bold uppercase tracking-[0.14em] shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            Case Study ? Team Delta
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_10px_48px_rgba(0,0,0,0.8)]">
            Risk Analysis Swarm
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {[
            { Icon: FileText, label: "Annual Reports" },
            { Icon: Database, label: "SCB Statistics" },
            { Icon: Users, label: "Public Registry" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="p-7 bg-black/55 backdrop-blur-md border border-white/20 text-center shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
            >
              <Icon
                className="h-7 w-7 text-accent mb-4 mx-auto [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.9))]"
                aria-hidden="true"
              />
              <span className="text-sm md:text-base text-white/90 uppercase tracking-[0.14em] font-bold [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full px-8 py-9 md:px-10 md:py-10 bg-black/55 backdrop-blur-md border border-white/20 space-y-6 shadow-[0_12px_48px_rgba(0,0,0,0.55)]">
          <p className="text-center text-white/95 text-lg md:text-2xl leading-snug max-w-4xl mx-auto [text-wrap:balance] [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
            Today, specialists spend substantial time gathering data, so only a subset of companies can be reviewed deeply. With the swarm, we can run a <span className="text-accent font-semibold">first-pass risk analysis at scale</span> across far more companies.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex justify-between items-end gap-3">
                <span className="text-base md:text-lg uppercase tracking-[0.1em] text-white/95 font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                  Human Analyst
                </span>
                <span className="text-base md:text-lg font-mono text-white/90 shrink-0 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                  Days of manual work
                </span>
              </div>
              <Progress value={100} className="h-1.5 bg-white/15" />
            </div>
            <div className="flex flex-col items-center shrink-0 gap-1">
              <Clock className="h-6 w-6 text-accent [filter:drop-shadow(0_0_10px_hsl(var(--accent)/0.5))]" aria-hidden="true" />
              <span className="text-sm md:text-base uppercase tracking-[0.14em] text-accent font-black [text-shadow:0_0_12px_hsl(var(--accent)/0.45)]">
                VS
              </span>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <div className="flex justify-between items-end gap-3">
                <span className="text-base md:text-lg uppercase tracking-[0.1em] text-accent font-bold [text-shadow:0_0_12px_hsl(var(--accent)/0.35)]">
                  Agent Swarm
                </span>
                <span className="text-base md:text-lg font-mono text-accent font-medium shrink-0 [text-shadow:0_0_14px_hsl(var(--accent)/0.4)]">
                  Minutes of AI reasoning
                </span>
              </div>
              <Progress value={3} className="h-1.5 bg-white/15" />
            </div>
          </div>
          <p className="text-center text-white/90 text-base md:text-lg uppercase tracking-[0.1em] font-mono font-medium border-t border-white/15 pt-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
            Serial + parallel agent execution{"\u2014"}{" "}
            callback orchestration
          </p>
        </div>
      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 6 ? THE VERDICT
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={5}
        chapterName="The Verdict"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[5]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "winner-bg")?.imageUrl ?? ""}
        contentClassName="w-full max-w-6xl mx-auto space-y-8 px-4 pt-12 md:pt-14"
        overlayGradientClassName="from-black/90 via-black/48 to-black/92"
        videoLoadedOpacityClassName="opacity-[0.55]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_70%_at_50%_45%,rgba(0,0,0,0.52),transparent_72%)]"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter [text-shadow:0_2px_20px_rgba(0,0,0,0.9)]">
            What we learned
          </h2>
          <p className="text-sm md:text-base text-white/55 font-medium tracking-wide">
            Two days. Three teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full">
          {(
            [
              {
                team: "Team Alpha",
                anchor: "Influencer Risk Swarm",
                head: "Agents bring order to unstructured data.",
                body: (
                  <>
                    A swarm of agents searches massive amounts of unstructured social media data at high speed, making complex signals understandable and surfacing possible tax risks.
                  </>
                ),
              },
              {
                team: "Team Bravo",
                anchor: "Skatti 2.0",
                head: (
                  <>
                    Legal precision needs both {"\u201c"}what{"\u201d"} and {"\u201c"}how{"\u201d"}.
                  </>
                ),
                body: (
                  <>
                    We learned that context and structure matter. The official{"\u201c"}what{"\u201d"} was not enough. LLMs recognise patterns, not truth, so legal answers also need the pedagogical{"\u201c"}how{"\u201d"}.
                  </>
                ),
              },
              {
                team: "Team Delta",
                anchor: "Company Risk Analysis Swarm",
                head: "From gathering data to analysing it.",
                body: (
                  <>
                    A swarm gathers large amounts of data fast, freeing experts from collecting information so they can focus on analysis.
                  </>
                ),
              },
            ] as const
          ).map((item) => (
            <div
              key={item.team}
              className="flex flex-col rounded-xl border border-white/15 bg-black/55 p-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-7 md:text-center"
            >
              <span className="text-accent text-xs md:text-sm font-bold uppercase tracking-[0.16em]">
                {item.team}
              </span>
              <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.12em] text-white/75 font-semibold">
                {item.anchor}
              </p>
              <h3 className="mt-3 text-base font-bold leading-snug text-white md:text-2xl [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                {item.head}
              </h3>
            </div>
          ))}
        </div>

        <p className="mx-auto max-w-3xl text-center text-base md:text-lg font-medium leading-relaxed tracking-tight text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
          Code is no longer the bottleneck...
        </p>
      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 7 ? THE WISDOM
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={6}
        chapterName="The Wisdom"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[6]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "takeaway-bg")?.imageUrl ?? ""}
        contentClassName="space-y-10 md:space-y-12 max-w-5xl mx-auto px-6 w-full"
        overlayGradientClassName="from-black/88 via-black/40 to-black/90"
        videoLoadedOpacityClassName="opacity-[0.58]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_110%_75%_at_50%_55%,rgba(0,0,0,0.45),transparent_75%)]"
      >
        <div className="space-y-5 text-center">
          <span className="text-accent text-base md:text-xl font-bold uppercase tracking-[0.14em] font-mono">
            The Core Insight
          </span>
          <p className="text-2xl md:text-4xl font-light text-white leading-tight [text-wrap:balance] [text-shadow:0_2px_18px_rgba(0,0,0,0.9)]">
            {"\u201c"}Agents are{" "}
            <span className="text-accent font-semibold not-italic">
              all-knowing trainees with superpowers
            </span>
            {"\u2014"} fast and capable, but without judgment.{"\u201d"}
          </p>
        </div>

        <div className="w-full pt-6 md:pt-8 border-t border-white/15">
          <p className="mb-5 text-center text-base md:text-lg font-mono font-semibold uppercase tracking-[0.1em] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
            WHAT MULTIPLE AGENTS NEED
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
            <div className="rounded-xl border border-white/20 bg-black/55 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-7">
              <ShieldCheck className="mx-auto mb-3 h-7 w-7 text-accent [filter:drop-shadow(0_0_12px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
              <span className="block text-xl md:text-2xl font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                Boundaries
              </span>
              <span className="mt-2 block text-base md:text-lg font-medium text-white/90 leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                Define what each agent may decide on its own.
              </span>
            </div>
            <div className="rounded-xl border border-white/20 bg-black/55 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-7">
              <Workflow className="mx-auto mb-3 h-7 w-7 text-accent [filter:drop-shadow(0_0_12px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
              <span className="block text-xl md:text-2xl font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                Orchestration
              </span>
              <span className="mt-2 block text-base md:text-lg font-medium text-white/90 leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                Who passes what to whom{"\u2014"}and when.
              </span>
            </div>
            <div className="rounded-xl border border-white/20 bg-black/55 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-7">
              <Compass className="mx-auto mb-3 h-7 w-7 text-accent [filter:drop-shadow(0_0_12px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
              <span className="block text-xl md:text-2xl font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                Direction
              </span>
              <span className="mt-2 block text-base md:text-lg font-medium text-white/90 leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                Set the goal. Then have the patience to let them learn.
              </span>
            </div>
          </div>
          <p className="mt-6 text-center text-base md:text-lg font-mono uppercase tracking-[0.1em] text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
            Less software thinking {"\u00b7"} more design team thinking.
          </p>
        </div>
      </PresentationSection>

      {/* ????????????????????????????????????????????????????????????????????????
          SLIDE 8 ? THE FUTURE
          Minimal text. The speaker delivers the close live.
          The screen just holds two lines and silence.
      ???????????????????????????????????????????????????????????????????????? */}
      <PresentationSection
        sectionIndex={7}
        chapterName="The Future"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[7]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "hero-bg")?.imageUrl ?? ""}
        contentClassName="w-full max-w-5xl mx-auto space-y-5 md:space-y-6 px-6 pt-6"
        overlayGradientClassName="from-black/92 via-black/52 to-black/93"
        videoLoadedOpacityClassName="opacity-[0.55]"
        midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_72%_at_50%_46%,rgba(0,0,0,0.48),transparent_74%)]"
      >
        <div className="text-center space-y-2 md:space-y-3">
          <p className="text-2xl font-light text-white/90 tracking-tight md:text-4xl [text-shadow:0_2px_20px_rgba(0,0,0,0.9)] [text-wrap:balance]">
            We walked in with questions.
          </p>
          <h2 className="text-4xl font-black text-white tracking-tighter md:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
            We walked out with{" "}
            <span className="text-accent">answers.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full">
          <div className="rounded-xl border border-white/15 bg-black/55 p-6 md:p-7 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="h-6 w-6 text-accent [filter:drop-shadow(0_0_10px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
              <span className="text-base md:text-lg font-mono font-bold uppercase tracking-[0.12em] text-accent [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                Reflection 01
              </span>
            </div>
            <p className="text-lg md:text-2xl font-medium leading-snug text-white/95 [text-wrap:balance] [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
              Speed is no longer the limit. Knowing what is{" "}
              <span className="text-accent font-semibold">valuable</span> is.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/55 p-6 md:p-7 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-accent [filter:drop-shadow(0_0_10px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
              <span className="text-base md:text-lg font-mono font-bold uppercase tracking-[0.12em] text-accent [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                Reflection 02
              </span>
            </div>
            <p className="text-lg md:text-2xl font-medium leading-snug text-white/95 [text-wrap:balance] [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
              The distance between an idea and the software has{" "}
              <span className="text-accent font-semibold">collapsed</span>.
            </p>
          </div>
        </div>

        <p className="mx-auto max-w-4xl text-center text-xl md:text-3xl font-semibold leading-snug text-white [text-wrap:balance] [text-shadow:0_2px_18px_rgba(0,0,0,0.9)]">
          The winning team isn{"\u2019"}t the one that ships the most code.{" "}
          <span className="text-accent">It{"\u2019"}s the one that learns fastest.</span>
        </p>

        <p className="mx-auto max-w-2xl text-center text-lg font-light text-white/90 md:text-2xl [text-shadow:0_2px_18px_rgba(0,0,0,0.9)] [text-wrap:balance]">
          Two days. One room. A few curious people. That{"\u2019"}s all it took.
        </p>

        <footer className="mx-auto max-w-2xl space-y-1.5 pt-4 text-center">
          <p className="text-base italic font-light text-white/90 md:text-xl [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] [text-wrap:balance]">
            {"\u201c"}The future is already here{"\u2014"}{" "}
            it{"\u2019"}s just not evenly distributed.{"\u201d"}
          </p>
          <p className="text-sm font-mono uppercase tracking-[0.1em] text-white/75 md:text-base">
            {"\u2014"} William Gibson
          </p>
        </footer>
      </PresentationSection>
    </main>

    {/* ??????????????????????????????????????????????????????????????????????
        OVERLAYS ? rendered OUTSIDE <main> so they are not children of
        the scroll container. This guarantees correct fixed positioning
        and z-index stacking on all browsers.
    ?????????????????????????????????????????????????????????????????????? */}

    {/* Evidence card — centered, ~80vw when revealed on Swarm slide */}
    <div
      className={cn(
        "fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10 transition-opacity duration-700 ease-out bg-black/60 backdrop-blur-sm",
        showEvidence ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setSubStep(0)}
      aria-hidden={!showEvidence}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-[80vw] max-w-7xl rounded-xl border border-white/10 bg-card/95 backdrop-blur-md p-5 md:p-8 shadow-2xl transition-[transform] duration-700 ease-out will-change-transform",
          showEvidence ? "scale-100 translate-y-0" : "scale-[0.97] translate-y-6"
        )}
        aria-label="Case evidence card"
      >
        <button
          type="button"
          onClick={() => setSubStep(0)}
          className="absolute top-4 right-4 z-10 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/60 border border-white/10 rounded-sm transition-colors cursor-pointer"
          aria-label="Close evidence card (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative w-full min-h-[min(42vh,520px)] max-h-[55vh] overflow-hidden rounded-lg bg-muted">
          <img
            src="/images/influencerJail.png"
            alt="Swedish influencer sentenced for tax evasion"
            className="h-full w-full object-contain object-top md:object-center bg-black/40"
            width={1200}
            height={675}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
          <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5">
            <span className="bg-red-500 text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
              Real Case
            </span>
          </div>
        </div>
        <h4 className="mt-5 text-white font-black text-xl md:text-3xl tracking-tight">
          He went to jail.
        </h4>
        <p className="mt-2 text-white/45 text-sm md:text-lg leading-relaxed italic max-w-3xl">
          Our swarm could have nudged him months earlier.
        </p>
      </aside>
    </div>

    {/* ?? Technical Blueprint Deep-Dive Overlay ?? */}
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-black flex overflow-hidden transition-opacity duration-500 ease-out will-change-[opacity]",
        isDeepDiveActive
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-title"
    >
      {/* Close button */}
      <button
        onClick={handleCloseDeepDive}
        className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white bg-white/10 p-3 border border-white/20 transition-all duration-200 hover:scale-105 hover:border-white/40"
        aria-label="Close blueprint (Esc)"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Left sidebar ? fixed width, full height, scrollable if needed */}
      <div
        className={cn(
          "w-72 shrink-0 flex flex-col min-h-0 h-full border-r border-white/10",
          isDeepDiveActive && "deep-dive-active"
        )}
      >
        <div className="flex-1 flex flex-col justify-center gap-5 px-8 py-10 min-h-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
              Swarm Architecture
            </div>
            <h2
              id="blueprint-title"
              className="text-2xl font-black text-white tracking-tighter leading-tight pt-2"
            >
              Five-Phase<br />Execution
            </h2>
          </div>

          <div className="space-y-2">
            {[
              { title: "Data Gathering",         desc: "Channel mapping & social scraping" },
              { title: "Parallel Research",       desc: "Pricing, affiliates, barter, donations ? simultaneously" },
              { title: "Risk Assessment",         desc: "Reason over all findings, zero search tools" },
              { title: "Follow-up Investigation", desc: "JSON task plan spawns N dynamic workers" },
              { title: "Compliance Report",       desc: "Swedish report with verified citations" },
            ].map((item, i) => {
              const isActive = activePhase === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "deep-dive-phase flex items-start gap-3 rounded-lg px-2 py-2 -mx-2 transition-all duration-500",
                    isActive ? "bg-accent/10" : "bg-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0 w-7 h-7 border flex items-center justify-center font-mono text-xs transition-all duration-500",
                      isActive
                        ? "bg-accent text-black border-accent shadow-[0_0_14px_hsl(var(--accent)/0.6)]"
                        : "bg-accent/15 border-accent/30 text-accent"
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "block font-bold text-sm leading-snug transition-colors duration-500",
                        isActive ? "text-accent" : "text-white"
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "block text-[9px] uppercase tracking-widest mt-0.5 leading-snug transition-colors duration-500",
                        isActive ? "text-accent/60" : "text-white/30"
                      )}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shrink-0 px-8 pb-8 pt-4 border-t border-white/10">
          {isSpeaking ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 h-4 bg-accent animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
              <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em]">
                AI narrating?
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {isNarrationPending && (
                <p className="text-white/35 font-mono text-[9px] uppercase tracking-[0.35em]">
                  Assistant preparing response?
                </p>
              )}
              <button
                type="button"
                onPointerDown={onPushToTalkPointerDown}
                onPointerUp={onPushToTalkPointerUp}
                onPointerCancel={onPushToTalkPointerUp}
                aria-pressed={isPushToTalkPressed}
                aria-label="Hold to speak to the assistant. Release to hear the explanation."
                className={cn(
                  "w-full flex flex-col items-center gap-3 rounded-xl border px-4 py-5 transition-all duration-200 select-none touch-none",
                  "border-white/15 bg-white/[0.04] hover:border-accent/35 hover:bg-white/[0.06]",
                  isPushToTalkPressed &&
                    "border-accent/60 bg-accent/15 ring-2 ring-accent/40 ring-offset-2 ring-offset-black scale-[1.02]"
                )}
              >
                <Volume2
                  className={cn(
                    "h-9 w-9 text-accent transition-transform duration-200",
                    isPushToTalkPressed && "scale-110 animate-pulse [filter:drop-shadow(0_0_14px_hsl(var(--accent)))]"
                  )}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/45 text-center leading-relaxed">
                  {isPushToTalkPressed
                    ? "Speaking\u2026"
                    : "Hold \u2014 address the assistant"}
                </span>
                <span className="text-[9px] text-white/25 text-center leading-snug">
                  Release to send. The agent replies after a short pause.
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right panel ? image + SVG phase overlay */}
      <div className="flex-1 flex items-center justify-center p-6 min-w-0">
        {/*
          The image and SVG must both fill this container absolutely.
          object-contain and preserveAspectRatio="xMidYMid meet" use the
          same algorithm, so SVG rects align pixel-perfectly with the diagram.
        */}
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
          <img
            src="/images/flowInfluencer.png"
            alt="Five-phase swarm architecture diagram"
            className="absolute inset-0 w-full h-full object-contain shadow-2xl"
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1918 1078"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {PHASE_REGIONS.map((r, i) => (
              <g
                key={i}
                style={{
                  opacity: activePhase === i ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
              >
                {/* Soft fill tint */}
                <rect
                  x={r.x} y={r.y} width={r.w} height={r.h} rx={10}
                  style={{ fill: "hsl(var(--accent) / 0.12)" }}
                />
                {/* Glowing accent border */}
                <rect
                  x={r.x} y={r.y} width={r.w} height={r.h} rx={10}
                  style={{
                    fill: "none",
                    stroke: "hsl(var(--accent))",
                    strokeWidth: "4",
                    filter: "drop-shadow(0 0 10px hsl(var(--accent) / 0.8))",
                  }}
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
    </>
  );
}
