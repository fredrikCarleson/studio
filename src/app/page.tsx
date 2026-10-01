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
import { OperatingModelDiagram } from "@/components/OperatingModelDiagram";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";

// ─── Video Assets ─────────────────────────────────────────────────────────────

const LOCAL_VIDEOS = [
  "/videos/Sunrise_over_Stockholm_202604071643.mp4",          // 1 — Prologue
  "/videos/Modern_tech_office_202604071647.mp4",               // 2 — The Vision
  "/videos/slide-3-the-swarm.mp4",                             // 3 — The Swarm
  "/videos/slide-4-the-knowledge-splitv2.mp4",                  // 4 — The Pedagogy
  "/videos/slide-5-the-automation.mp4",                        // 5 — The Automation
  "/videos/slide-6-the-verdict.mp4",                           // 6 — The Verdict
  "/videos/slide-7-the-wisdom.mp4",                            // 7 — The Wisdom
  "/videos/slide-8-the-future.mp4",                            // 8 — The Future
  "/videos/slide-9-the-calm.mp4",                              // 9 — Arbetssätt & Styrning
  "/videos/slide-9-the-calm-2.mp4",                            // 10 — Thank You
] as const;

/**
 * Pre-generated MP3 for bulletproof stage playback (English & Swedish).
 * Falls back to live TTS only if these files are missing.
 */
const BLUEPRINT_AUDIO_URL_EN = "/audio/blueprint-narration.mp3";
const BLUEPRINT_AUDIO_URL_SV = "/audio/blueprint-narration-sv.mp3";

/** Simulated “agent thinks, then replies” after you release push-to-talk */
const BLUEPRINT_NARRATION_DELAY_MS = 1600;

/**
 * When each phase is discussed in the blueprint narration MP3 (seconds).
 */
const PHASE_TIMESTAMPS_EN: { start: number; end: number }[] = [
  { start: 8,  end: 19 }, // Phase 1 — Data Gathering
  { start: 19, end: 32 }, // Phase 2 — Parallel Research
  { start: 32, end: 42 }, // Phase 3 — Risk Assessment
  { start: 42, end: 57 }, // Phase 4 — Follow-up Investigation
  { start: 57, end: 69 }, // Phase 5 — Compliance Report
];

const PHASE_TIMESTAMPS_SV: { start: number; end: number }[] = [
  { start: 8.5, end: 21.2 }, // Fas 1 — Datainsamling
  { start: 21.2, end: 33.6 }, // Fas 2 — Parallell Research
  { start: 33.6, end: 43.8 }, // Fas 3 — Riskbedömning
  { start: 43.8, end: 56.6 }, // Fas 4 — Uppföljande Undersökning
  { start: 56.6, end: 65.0 }, // Fas 5 — Revisionsrapport
];

/**
 * Phase highlight bounding boxes in the flowInfluencer.png natural coordinate
 * space (1918 x 1078 px).
 */
const PHASE_REGIONS: { x: number; y: number; w: number; h: number }[] = [
  { x: 5,    y: 5,   w: 630,  h: 680 }, // Phase 1 — Initial Data Gathering
  { x: 445,  y: 5,   w: 975,  h: 590 }, // Phase 2 — Parallel Research
  { x: 1345, y: 245, w: 570,  h: 390 }, // Phase 3 — Risk Assessment
  { x: 445,  y: 590, w: 1470, h: 385 }, // Phase 4 — Follow-up Investigator
  { x: 690,  y: 835, w: 1225, h: 240 }, // Phase 5 — Compliance Report
];

/**
 * Slides with sub-steps: pressing "next" cycles through sub-steps
 * before advancing to the next slide. value = number of extra steps.
 * Slide 3 (index 2): step 0 = slide content, step 1 = evidence card.
 * Slide 9 (index 8): step 0 = Paradigmskiftet, step 1 = 4 Stadier, step 2 = Gradvis Styrning, step 3 = Portföljens roll, step 4 = Helhetsbilden.
 */
const SLIDE_SUB_STEPS: Record<number, number> = {
  2: 1,
  8: 4,
};

// ─── SessionTimer (isolated to avoid full-page re-renders on tick) ─────────────

const SessionTimer = memo(({ sessionLabel = "Session" }: { sessionLabel?: string }) => {
  const [totalSeconds, setTotalSeconds] = useState(1800); // 30 min default
  const [timeLeft, setTimeLeft] = useState(1800);
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
    setTimeLeft(totalSeconds);
    setIsRunning(false);
  }, [totalSeconds]);

  const toggleDuration = useCallback(() => {
    setTotalSeconds((prev) => {
      const next = prev === 900 ? 1800 : 900;
      setTimeLeft(next);
      setIsRunning(false);
      return next;
    });
  }, []);

  return (
    <div className="flex items-center gap-3 md:gap-5 px-4 md:px-5 py-3 bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
      <div
        className="flex flex-col items-end border-r border-white/10 pr-4 md:pr-5 cursor-pointer select-none"
        onDoubleClick={handleReset}
        title="Double-click to reset"
      >
        <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">
          {sessionLabel} ({Math.round(totalSeconds / 60)}m)
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
          onClick={toggleDuration}
          title="Toggle 15m / 30m duration"
          className="h-8 px-2 flex items-center justify-center border border-white/10 text-white/50 hover:text-accent hover:border-accent/40 transition-colors duration-200 rounded-sm text-[10px] font-mono cursor-pointer"
        >
          {totalSeconds === 1800 ? "30m" : "15m"}
        </button>
        <button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center border border-white/10 text-white/40 hover:text-accent hover:border-accent/40 transition-colors duration-200 rounded-sm text-sm font-mono cursor-pointer"
          aria-label={isRunning ? "Pause timer" : "Resume timer"}
        >
          {isRunning ? "⏸" : "▶"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          title={`Reset timer to ${Math.round(totalSeconds / 60)}:00`}
          className="h-8 w-8 md:h-9 md:w-9 flex items-center justify-center border border-white/10 text-white/25 hover:text-white hover:border-white/30 transition-colors duration-200 rounded-sm text-xs font-mono cursor-pointer"
          aria-label={`Reset timer to ${Math.round(totalSeconds / 60)}:00`}
        >
          {"↺"}
        </button>
      </div>
    </div>
  );
});
SessionTimer.displayName = "SessionTimer";

// ─── HUD ──────────────────────────────────────────────────────────────────────

type HUDProps = {
  currentIndex: number;
  progressValue: number;
  isHidden: boolean;
  onToggleKeyboard: () => void;
  language: Language;
  onToggleLanguage: () => void;
  chapterName: string;
  chapterOfText: string;
  keysLabel: string;
  sessionLabel: string;
  betaTag: string;
};

const PresentationHUD = memo(({
  currentIndex,
  progressValue,
  isHidden,
  onToggleKeyboard,
  language,
  onToggleLanguage,
  chapterName,
  chapterOfText,
  keysLabel,
  sessionLabel,
  betaTag,
}: HUDProps) => (
  <div
    className={cn(
      "fixed top-0 left-0 w-full z-[80] p-8 flex justify-between items-start transition-[opacity,transform] duration-500 ease-out",
      isHidden ? "opacity-0 pointer-events-none -translate-y-3" : "opacity-100 translate-y-0"
    )}
  >
    <div className="flex flex-col gap-2 w-72">
      <div className="flex flex-col mb-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-accent/50">
          {chapterOfText}
        </span>
        <span className="text-sm font-bold tracking-tight text-white uppercase">
          {chapterName}
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
      <SessionTimer sessionLabel={sessionLabel} />
      <div className="flex items-center gap-2">
        {/* Language switch button */}
        <button
          type="button"
          onClick={onToggleLanguage}
          className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[9px] tracking-wider rounded-sm select-none"
          aria-label={`Toggle language (currently ${language.toUpperCase()})`}
          title="Toggle Swedish / English (Shortcut: L)"
        >
          <span className={cn(language === "sv" ? "text-accent font-black underline decoration-accent/60" : "text-white/40")}>SV</span>
          <span className="text-white/20">|</span>
          <span className={cn(language === "en" ? "text-accent font-black underline decoration-accent/60" : "text-white/40")}>EN</span>
        </button>

        <div className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-sm">
          <span className="text-[9px] font-bold tracking-[0.5em] text-accent uppercase">
            {betaTag}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleKeyboard}
          className="px-3 py-1 bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-colors cursor-pointer rounded-sm"
          aria-label="Toggle keyboard shortcuts"
        >
          <span className="text-[9px] font-mono text-white/45 hover:text-accent uppercase tracking-widest">
            {keysLabel}
          </span>
        </button>
      </div>
    </div>
  </div>
));
PresentationHUD.displayName = "PresentationHUD";

// ─── Navigation Timeline ──────────────────────────────────────────────────────

type NavProps = {
  currentIndex: number;
  scrollToSection: (i: number) => void;
  isHidden: boolean;
  chapters: readonly string[];
};

const NavigationTimeline = memo(({ currentIndex, scrollToSection, isHidden, chapters }: NavProps) => (
  <nav
    className={cn(
      "fixed left-10 top-1/2 -translate-y-1/2 z-[80] flex flex-col gap-8 transition-[opacity,transform] duration-500 ease-out",
      isHidden ? "opacity-0 pointer-events-none -translate-x-6" : "opacity-100 translate-x-0"
    )}
    aria-label="Slide navigation"
  >
    {chapters.map((name, i) => (
      <button
        key={i}
        type="button"
        onClick={() => scrollToSection(i)}
        className="group relative flex items-center cursor-pointer"
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

// ─── Keyboard Reference Overlay ───────────────────────────────────────────────

type KeyboardRefProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  shortcuts: { key: string; action: string }[];
};

const KeyboardReference = memo(({ isOpen, onClose, title, closeLabel, shortcuts }: KeyboardRefProps) => (
  <div
    className={cn(
      "fixed bottom-12 right-12 z-[90] bg-black/90 backdrop-blur-xl border border-white/10 p-6 w-80 shadow-2xl transition-[opacity,transform] duration-300 ease-out rounded-lg",
      isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
    )}
    role="dialog"
    aria-label={title}
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Keyboard className="h-3.5 w-3.5 text-accent" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent">
          {title}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-white/30 hover:text-white transition-colors cursor-pointer"
        aria-label={closeLabel}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="space-y-2">
      {shortcuts.map(({ key, action }, i) => (
        <div key={i} className="flex justify-between items-center text-left">
          <kbd className="px-2 py-0.5 bg-white/10 border border-white/10 font-mono text-[10px] text-white/80 rounded-sm">
            {key}
          </kbd>
          <span className="text-[10px] text-white/50 text-right">{action}</span>
        </div>
      ))}
    </div>
  </div>
));
KeyboardReference.displayName = "KeyboardReference";

// ─── Main Presentation Component ─────────────────────────────────────────────

export default function Home() {
  const { language, toggleLanguage, t } = useLanguage();
  const chapters = t.nav.chapters;

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

  // Evidence card is driven by subStep on Slide 3
  const showEvidence = currentIndex === 2 && subStep >= 1 && !isDeepDiveActive;

  // ─── Navigation with sub-step awareness ─────────────────────────────────────

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= chapters.length) return;
    const container = containerRef.current;
    if (container) {
      const sections = container.querySelectorAll<HTMLElement>(".snap-section");
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: "smooth" });
      } else {
        container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
      }
    }
  }, [chapters.length]);

  const advanceForward = useCallback(() => {
    const maxSub = SLIDE_SUB_STEPS[currentIndex] ?? 0;
    if (subStep < maxSub) {
      setSubStep((s) => s + 1);
    } else {
      if (currentIndex < chapters.length - 1) {
        scrollToSection(currentIndex + 1);
      }
    }
  }, [currentIndex, subStep, chapters.length, scrollToSection]);

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

  // ─── Deep Dive — overlay narration controls ─────────────────────────────────

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

    audio.src = language === "sv" ? BLUEPRINT_AUDIO_URL_SV : BLUEPRINT_AUDIO_URL_EN;
    try {
      await audio.play();
    } catch {
      try {
        const { generateAssistantSpeech } = await import("@/ai/flows/tts-flow");
        const NARRATION_EN =
          "Hi Fredrik. Of course I can explain the diagram for you. " +
          "This is the five-phase swarm architecture we built during the hackathon. " +
          "Phase one starts with a parallel multi-modal scraper — the channel mapper and Instagram scraper agent pull social data at scale. " +
          "Phase two fans out into parallel research. A product identifier prices items, while affiliate mappers, barter investigators, and donation mappers each handle their speciality — all running simultaneously. " +
          "Phase three is the risk assessor. It analyses all previous findings without any search tools, purely reasoning over what the other agents discovered. " +
          "Phase four is where it gets interesting. A follow-up planner creates a JSON task plan, and a dynamic parallel research executor spawns Worker 1 through Worker N on demand. " +
          "And finally, phase five — the report synthesizer produces a complete Swedish compliance report with proper citations. " +
          "What used to take analysts days now happens in minutes.";
        const NARRATION_SV =
          "Hej Fredrik. Självklart kan jag förklara diagrammet för dig. " +
          "Det här är den femfasiga svärmarkitektur som vi byggde under hackathonet. " +
          "Fas ett inleds med datainsamling i stor skala — kanal-analytikern och Instagram-scrapern samlar in publik social data i hög hastighet. " +
          "Fas två grenar ut i parallell research. En värderingsagent prissätter produkter, medan agenter för affiliates, byteshandel och gåvor analyserar flödet parallellt. " +
          "Fas tre är riskbedömningen. Den analyserar alla samlade fynd helt utan sökverktyg — ren slutledningsförmåga över vad de andra agenterna upptäckt. " +
          "I fas fyra blir det riktigt intressant. En uppföljande planerare skapar en JSON-uppgiftsplan, och den dynamiska forskningsmotorn startar upp specialiserade agenter efter behov — Worker 1 till Worker N. " +
          "Och slutligen, fas fem — rapportsyntetiseraren skapar en komplett svensk revisionsrapport med verifierade källhänvisningar. " +
          "Det som tidigare tog utredare flera dagar sker nu på några få minuter.";
        const response = await generateAssistantSpeech({
          text: language === "sv" ? NARRATION_SV : NARRATION_EN,
        });
        audio.src = response.mediaUrl;
        await audio.play();
      } catch {
        setIsSpeaking(false);
      }
    }
  }, [language]);

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

  // ─── Blueprint phase sync ───────────────────────────────────────────────────

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

    const timestamps = language === "sv" ? PHASE_TIMESTAMPS_SV : PHASE_TIMESTAMPS_EN;

    const tick = () => {
      const tSec = audio.currentTime;
      let phase = -1;
      for (let i = 0; i < timestamps.length; i++) {
        if (tSec >= timestamps[i].start && tSec < timestamps[i].end) {
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
  }, [isSpeaking, language]);

  // ─── Mouse-idle HUD auto-hide ──────────────────────────────────────────────

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

  // ─── Keyboard Stage Controls ───────────────────────────────────────────────

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

        case "l":
        case "L":
          toggleLanguage();
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
  }, [currentIndex, subStep, isDeepDiveActive, showKeyboard, advanceForward, goBack, openBlueprintOverlay, handleCloseDeepDive, toggleLanguage]);

  // ─── Derived ───────────────────────────────────────────────────────────────

  const progressValue = useMemo(
    () => ((currentIndex + 1) / chapters.length) * 100,
    [currentIndex, chapters.length]
  );

  const hudHidden = isUIHidden || isDeepDiveActive;

  // ─── Render ────────────────────────────────────────────────────────────────

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
          language={language}
          onToggleLanguage={toggleLanguage}
          chapterName={chapters[currentIndex] ?? ""}
          chapterOfText={t.nav.chapterOf(currentIndex + 1, chapters.length)}
          keysLabel={t.nav.keys}
          sessionLabel={t.nav.session}
          betaTag={t.nav.betaTag}
        />

        <NavigationTimeline
          currentIndex={currentIndex}
          scrollToSection={scrollToSection}
          isHidden={hudHidden}
          chapters={chapters}
        />

        <KeyboardReference
          isOpen={showKeyboard}
          onClose={() => setShowKeyboard(false)}
          title={t.keyboard.title}
          closeLabel={t.keyboard.close}
          shortcuts={t.keyboard.shortcuts}
        />

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 1 — PROLOGUE
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={0}
          chapterName={chapters[0]}
          scrollRootRef={containerRef}
          onSectionActiveChange={handleSectionActiveChange}
          videoUrl={LOCAL_VIDEOS[0]}
          fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "hero-bg")?.imageUrl ?? ""}
          priority
        >
          <h1 className="text-5xl md:text-[7.5rem] font-black tracking-tighter text-white max-w-5xl leading-[0.88] mb-8 [text-wrap:balance]">
            {t.slide1.h1Line1}{" "}
            <span className="text-accent italic font-light">{t.slide1.h1Line2}</span>
            <br />
            {t.slide1.h1Line3}
            <br />
            {t.slide1.h1Line4}
          </h1>
          <p className="text-white/70 text-base md:text-lg font-mono tracking-[0.2em] uppercase [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
            {t.slide1.subtitle}
          </p>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 2 — THE VISION
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={1}
          chapterName={chapters[1]}
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
            {t.slide2.title}
          </h2>
          <p className="text-xl md:text-3xl font-light text-white/90 max-w-4xl mx-auto leading-relaxed [text-wrap:balance] [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_1px_2px_rgba(0,0,0,0.8)]">
            {t.slide2.mainP.before}
            <span className="text-accent font-semibold italic [text-shadow:0_0_28px_hsl(var(--accent)/0.45),0_2px_14px_rgba(0,0,0,0.95)]">
              {t.slide2.mainP.highlight}
            </span>
            {t.slide2.mainP.after}
          </p>
          <p className="mx-auto max-w-4xl text-xl md:text-3xl font-light italic leading-snug text-white/95 [text-wrap:balance] [text-shadow:0_2px_14px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.85)]">
            {t.slide2.quote}
          </p>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 3 — THE SWARM (Team Alpha)
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={2}
          chapterName={chapters[2]}
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
              {t.slide3.caseTag}
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_8px_40px_rgba(0,0,0,0.75)]">
              {t.slide3.title}
            </h2>
          </header>

          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <span className="block text-5xl font-black text-accent [text-shadow:0_2px_16px_rgba(0,0,0,0.95)]">
                {t.slide3.stat1Number}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-[0.14em] text-white/70 font-bold mt-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                {t.slide3.stat1Label}
              </span>
            </div>
            <div className="w-px h-14 bg-white/10" aria-hidden="true" />
            <div className="text-center">
              <span className="block text-5xl font-black text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.95)]">
                {t.slide3.stat2Number}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-[0.14em] text-white/70 font-bold mt-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                {t.slide3.stat2Label}
              </span>
            </div>
            <div className="w-px h-14 bg-white/10" aria-hidden="true" />
            <div className="text-center">
              <span className="block text-5xl font-black text-accent [text-shadow:0_2px_16px_rgba(0,0,0,0.95)]">
                {t.slide3.stat3Number}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-[0.14em] text-white/70 font-bold mt-1 block [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                {t.slide3.stat3Label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
            {t.slide3.cards.map((card) => (
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
              className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 cursor-pointer"
              aria-label="Open Technical Swarm Blueprint"
            >
              <Info className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.slide3.blueprintButton}
            </Button>
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 font-mono text-[9px] text-white/20 tracking-widest">
              B
            </kbd>
          </div>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 4 — THE PEDAGOGY (Team Bravo)
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={3}
          chapterName={chapters[3]}
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
              {t.slide4.caseTag}
            </div>
            <p className="text-base md:text-lg font-mono uppercase tracking-[0.12em] text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
              {t.slide4.subtitle}
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]">
              {t.slide4.title}
            </h2>
          </div>

          <figure className="mx-auto flex w-full max-w-5xl flex-col items-center rounded-xl border border-accent/40 bg-black/60 px-7 py-6 text-center shadow-[0_16px_56px_rgba(0,0,0,0.55)] backdrop-blur-md md:px-14 md:py-8">
            <div className="w-full max-w-[34rem] md:max-w-[42rem] space-y-3">
              <figcaption className="text-base font-mono font-semibold uppercase tracking-[0.1em] text-accent [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] md:text-lg md:tracking-[0.12em]">
                {t.slide4.surpriseLabel}
              </figcaption>
              <blockquote className="text-xl font-medium leading-snug text-white [text-wrap:balance] [text-shadow:0_2px_16px_rgba(0,0,0,0.9)] md:text-[1.5rem] md:leading-[1.3]">
                {t.slide4.surpriseQuote}
              </blockquote>
              <p className="text-base font-mono font-semibold uppercase tracking-[0.1em] text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] md:text-lg md:tracking-[0.12em]">
                {t.slide4.lessonLabel}
              </p>
            </div>
          </figure>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-px bg-white/10 w-full rounded-lg md:rounded-none overflow-hidden md:overflow-visible">
            <div className="p-5 md:p-7 bg-black/60 backdrop-blur-md text-center border border-white/10 md:border-white/5 rounded-lg md:rounded-none flex flex-col">
              <span className="text-accent font-mono text-base md:text-lg uppercase tracking-[0.1em] mb-3 block font-bold [text-shadow:0_0_20px_hsl(var(--accent)/0.25)]">
                {t.slide4.col1Tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
                {t.slide4.col1Title}
              </h3>
              <p className="text-white/90 text-lg md:text-xl leading-snug font-normal max-w-prose mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                {t.slide4.col1Desc}
              </p>
              <div className="mt-auto pt-5">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-green-500/15 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-base md:text-lg text-green-300 uppercase tracking-[0.1em] font-bold">
                    {t.slide4.col1Badge}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-7 bg-black/60 backdrop-blur-md text-center relative overflow-hidden border border-white/10 md:border-white/5 rounded-lg md:rounded-none flex flex-col">
              <div className="absolute top-4 right-4">
                <AlertTriangle className="text-red-500 h-5 w-5 animate-pulse [filter:drop-shadow(0_0_8px_rgba(239,68,68,0.5))]" aria-hidden="true" />
              </div>
              <span className="text-accent font-mono text-base md:text-lg uppercase tracking-[0.1em] mb-3 block font-bold [text-shadow:0_0_20px_hsl(var(--accent)/0.25)]">
                {t.slide4.col2Tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
                {t.slide4.col2Title}
              </h3>
              <p className="text-white/90 text-lg md:text-xl leading-snug font-normal max-w-prose mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                {t.slide4.col2Desc}
              </p>
              <div className="mt-auto pt-5">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-red-500/15 border border-red-500/30">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-base md:text-lg text-red-300 uppercase tracking-[0.1em] font-bold">
                    {t.slide4.col2Badge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 5 — THE AUTOMATION (Team Delta)
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={4}
          chapterName={chapters[4]}
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
              {t.slide5.caseTag}
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_10px_48px_rgba(0,0,0,0.8)]">
              {t.slide5.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {t.slide5.sources.map((label, idx) => {
              const icons = [FileText, Database, Users];
              const Icon = icons[idx] ?? FileText;
              return (
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
              );
            })}
          </div>

          <div className="w-full px-8 py-9 md:px-10 md:py-10 bg-black/55 backdrop-blur-md border border-white/20 space-y-6 shadow-[0_12px_48px_rgba(0,0,0,0.55)]">
            <p className="text-center text-white/95 text-lg md:text-2xl leading-snug max-w-4xl mx-auto [text-wrap:balance] [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
              {t.slide5.bodyP.before}
              <span className="text-accent font-semibold">{t.slide5.bodyP.highlight}</span>
              {t.slide5.bodyP.after}
            </p>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-end gap-3">
                  <span className="text-base md:text-lg uppercase tracking-[0.1em] text-white/95 font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                    {t.slide5.humanLabel}
                  </span>
                  <span className="text-base md:text-lg font-mono text-white/90 shrink-0 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                    {t.slide5.humanTime}
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
                    {t.slide5.swarmLabel}
                  </span>
                  <span className="text-base md:text-lg font-mono text-accent font-medium shrink-0 [text-shadow:0_0_14px_hsl(var(--accent)/0.4)]">
                    {t.slide5.swarmTime}
                  </span>
                </div>
                <Progress value={3} className="h-1.5 bg-white/15" />
              </div>
            </div>
            <p className="text-center text-white/90 text-base md:text-lg uppercase tracking-[0.1em] font-mono font-medium border-t border-white/15 pt-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
              {t.slide5.footerText}
            </p>
          </div>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 6 — THE VERDICT
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={5}
          chapterName={chapters[5]}
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
              {t.slide6.title}
            </h2>
            <p className="text-sm md:text-base text-white/55 font-medium tracking-wide">
              {t.slide6.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full">
            {t.slide6.cards.map((item) => (
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
                <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed font-normal">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto max-w-3xl text-center text-base md:text-lg font-medium leading-relaxed tracking-tight text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
            {t.slide6.footerQuote}
          </p>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 7 — THE WISDOM
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={6}
          chapterName={chapters[6]}
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
              {t.slide7.tag}
            </span>
            <p className="text-2xl md:text-4xl font-light text-white leading-tight [text-wrap:balance] [text-shadow:0_2px_18px_rgba(0,0,0,0.9)]">
              {t.slide7.headline.before}
              <span className="text-accent font-semibold not-italic">
                {t.slide7.headline.highlight}
              </span>
              {t.slide7.headline.after}
            </p>
          </div>

          <div className="w-full pt-6 md:pt-8 border-t border-white/15">
            <p className="mb-5 text-center text-base md:text-lg font-mono font-semibold uppercase tracking-[0.1em] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
              {t.slide7.subheading}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
              {t.slide7.cards.map((card, i) => {
                const icons = [ShieldCheck, Workflow, Compass];
                const Icon = icons[i] ?? ShieldCheck;
                return (
                  <div
                    key={card.title}
                    className="rounded-xl border border-white/20 bg-black/55 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-7"
                  >
                    <Icon className="mx-auto mb-3 h-7 w-7 text-accent [filter:drop-shadow(0_0_12px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
                    <span className="block text-xl md:text-2xl font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                      {card.title}
                    </span>
                    <span className="mt-2 block text-base md:text-lg font-medium text-white/90 leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                      {card.desc}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-center text-base md:text-lg font-mono uppercase tracking-[0.1em] text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
              {t.slide7.footerQuote}
            </p>
          </div>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 8 — THE FUTURE
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={7}
          chapterName={chapters[7]}
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
              {t.slide8.preline}
            </p>
            <h2 className="text-4xl font-black text-white tracking-tighter md:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
              {t.slide8.headline}
              <span className="text-accent">{t.slide8.headlineHighlight}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full">
            <div className="rounded-xl border border-white/15 bg-black/55 p-6 md:p-7 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="h-6 w-6 text-accent [filter:drop-shadow(0_0_10px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
                <span className="text-base md:text-lg font-mono font-bold uppercase tracking-[0.12em] text-accent [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                  {t.slide8.reflection1Tag}
                </span>
              </div>
              <p className="text-lg md:text-2xl font-medium leading-snug text-white/95 [text-wrap:balance] [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                {t.slide8.reflection1Text.before}
                <span className="text-accent font-semibold">{t.slide8.reflection1Text.highlight}</span>
                {t.slide8.reflection1Text.after}
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/55 p-6 md:p-7 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-accent [filter:drop-shadow(0_0_10px_hsl(var(--accent)/0.45))]" aria-hidden="true" />
                <span className="text-base md:text-lg font-mono font-bold uppercase tracking-[0.12em] text-accent [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                  {t.slide8.reflection2Tag}
                </span>
              </div>
              <p className="text-lg md:text-2xl font-medium leading-snug text-white/95 [text-wrap:balance] [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                {t.slide8.reflection2Text.before}
                <span className="text-accent font-semibold">{t.slide8.reflection2Text.highlight}</span>
                {t.slide8.reflection2Text.after}
              </p>
            </div>
          </div>

          <p className="mx-auto max-w-4xl text-center text-xl md:text-3xl font-semibold leading-snug text-white [text-wrap:balance] [text-shadow:0_2px_18px_rgba(0,0,0,0.9)]">
            {t.slide8.leadQuote.before}
            <span className="text-accent">{t.slide8.leadQuote.highlight}</span>
          </p>

          <p className="mx-auto max-w-2xl text-center text-lg font-light text-white/90 md:text-2xl [text-shadow:0_2px_18px_rgba(0,0,0,0.9)] [text-wrap:balance]">
            {t.slide8.twoDaysNote}
          </p>

          <footer className="mx-auto max-w-2xl space-y-1.5 pt-4 text-center">
            <p className="text-base italic font-light text-white/90 md:text-xl [text-shadow:0_1px_10px_rgba(0,0,0,0.85)] [text-wrap:balance]">
              {t.slide8.gibsonQuote}
            </p>
            <p className="text-sm font-mono uppercase tracking-[0.1em] text-white/75 md:text-base">
              {t.slide8.gibsonAuthor}
            </p>
          </footer>
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 9 — ARBETSSÄTT & STYRNING (THE OPERATING MODEL)
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={8}
          chapterName={chapters[8]}
          scrollRootRef={containerRef}
          onSectionActiveChange={handleSectionActiveChange}
          videoUrl={LOCAL_VIDEOS[8]}
          fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "hero-bg")?.imageUrl ?? ""}
          className="!items-start pt-12 md:pt-16"
          contentClassName="w-full max-w-7xl mx-auto space-y-5 px-4 !justify-start"
          overlayGradientClassName="from-black/92 via-black/55 to-black/92"
          videoLoadedOpacityClassName="opacity-[0.55]"
          midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_72%_at_50%_46%,rgba(0,0,0,0.5),transparent_75%)]"
        >
          <div className="text-center space-y-2 md:space-y-3">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]">
              {t.slide9.title.before}
              <span className="text-accent">{t.slide9.title.highlight}</span>
            </h2>
            <p className="font-mono text-xs md:text-sm uppercase tracking-[0.22em] text-white/60 font-semibold">
              {t.slide9.subtitle}
            </p>
          </div>

          <OperatingModelDiagram subStep={currentIndex === 8 ? subStep : 0} />
        </PresentationSection>

        {/* ────────────────────────────────────────────────────────────────────
            SLIDE 10 — THANK YOU / TACK
        ──────────────────────────────────────────────────────────────────── */}
        <PresentationSection
          sectionIndex={9}
          chapterName={chapters[9]}
          scrollRootRef={containerRef}
          onSectionActiveChange={handleSectionActiveChange}
          videoUrl={LOCAL_VIDEOS[9]}
          fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "hero-bg")?.imageUrl ?? ""}
          className="flex items-center justify-center"
          contentClassName="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4"
          overlayGradientClassName="from-black/85 via-black/35 to-black/85"
          videoLoadedOpacityClassName="opacity-[0.70]"
          midgroundOverlayClassName="bg-[radial-gradient(ellipse_100%_72%_at_50%_50%,rgba(0,0,0,0.4),transparent_70%)]"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-7xl md:text-9xl font-black text-white tracking-tight [text-shadow:0_4px_36px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-1000">
              {t.slide10.headline}
            </h2>
          </div>
        </PresentationSection>
      </main>

      {/* ────────────────────────────────────────────────────────────────────
          OVERLAYS — rendered OUTSIDE <main> so they are not children of
          the scroll container.
      ──────────────────────────────────────────────────────────────────── */}

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
            aria-label={t.slide3.evidence.closeAria}
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
              <span className="bg-red-500 text-[9px] font-bold px-2 py-1 uppercase tracking-widest text-white">
                {t.slide3.evidence.tag}
              </span>
            </div>
          </div>
          <h4 className="mt-5 text-white font-black text-xl md:text-3xl tracking-tight">
            {t.slide3.evidence.headline}
          </h4>
          <p className="mt-2 text-white/45 text-sm md:text-lg leading-relaxed italic max-w-3xl">
            {t.slide3.evidence.subline}
          </p>
        </aside>
      </div>

      {/* ── Technical Blueprint Deep-Dive Overlay ── */}
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
          className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white bg-white/10 p-3 border border-white/20 transition-all duration-200 hover:scale-105 hover:border-white/40 cursor-pointer"
          aria-label="Close blueprint (Esc)"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left sidebar — fixed width, full height */}
        <div
          className={cn(
            "w-72 shrink-0 flex flex-col min-h-0 h-full border-r border-white/10",
            isDeepDiveActive && "deep-dive-active"
          )}
        >
          <div className="flex-1 flex flex-col justify-center gap-5 px-8 py-10 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
                {t.slide3.blueprintModal.tag}
              </div>
              <h2
                id="blueprint-title"
                className="text-2xl font-black text-white tracking-tighter leading-tight pt-2"
              >
                {t.slide3.blueprintModal.titleLine1}
                <br />
                {t.slide3.blueprintModal.titleLine2}
              </h2>
            </div>

            <div className="space-y-2">
              {t.slide3.blueprintModal.phases.map((item, i) => {
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
                  {t.slide3.blueprintModal.narrating}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {isNarrationPending && (
                  <p className="text-white/35 font-mono text-[9px] uppercase tracking-[0.35em]">
                    {t.slide3.blueprintModal.preparing}
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
                    "w-full flex flex-col items-center gap-3 rounded-xl border px-4 py-5 transition-all duration-200 select-none touch-none cursor-pointer",
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
                      ? t.slide3.blueprintModal.speakingPrompt
                      : t.slide3.blueprintModal.idlePrompt}
                  </span>
                  <span className="text-[9px] text-white/25 text-center leading-snug">
                    {t.slide3.blueprintModal.subPrompt}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right panel — image + SVG phase overlay */}
        <div className="flex-1 flex items-center justify-center p-6 min-w-0">
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
