"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  Cpu,
  MessageSquare,
  Workflow,
  Trophy,
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
} from "lucide-react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Narrative Structure ───────────────────────────────────────────────────────

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
  "/videos/Sunrise_over_Stockholm_202604071643.mp4",
  "/videos/Modern_tech_office_202604071647.mp4",
  "/videos/AI_agents_collaborating_202604071648.mp4",
  "/videos/Digital_documents_sorted_202604071650.mp4",
  "/videos/Digital_reports_financial_202604071757.mp4",
  "/videos/Golden_particles_converging_202604071759.mp4",
  "/videos/Geometric_shapes_moving_202604071759.mp4",
  "/videos/Digital_horizon_leading_202604071800.mp4",
] as const;

/**
 * Pre-generated MP3 for bulletproof stage playback.
 * Falls back to live TTS only if this file is missing.
 */
const BLUEPRINT_AUDIO_URL = "/audio/blueprint-narration.mp3";

/**
 * Slides with sub-steps: pressing "next" cycles through sub-steps
 * before advancing to the next slide. value = number of extra steps.
 * Slide 3 (index 2): step 0 = slide content, step 1 = evidence card.
 */
const SLIDE_SUB_STEPS: Record<number, number> = {
  2: 1,
};

// ─── Keyboard Reference ────────────────────────────────────────────────────────

const KEYS = [
  { key: "→ / Space", action: "Next slide / sub-step" },
  { key: "←", action: "Previous slide" },
  { key: "B", action: "Blueprint overlay (Slide 3)" },
  { key: "H", action: "Toggle HUD" },
  { key: "F", action: "Fullscreen" },
  { key: "Esc", action: "Close overlay" },
  { key: "?", action: "This reference" },
];

// ─── SessionTimer (isolated to avoid full-page re-renders on tick) ─────────────

const SessionTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState(1200);
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

  return (
    <div className="flex items-center gap-5 px-5 py-3 bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
      <div className="flex flex-col items-end border-r border-white/10 pr-5">
        <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">
          Session Timer
        </span>
        <span
          className={cn(
            "font-mono text-2xl font-light tracking-tighter",
            isUrgent ? "text-red-500 animate-pulse" : "text-white"
          )}
        >
          {formatted}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsRunning((r) => !r)}
        className="h-9 w-9 flex items-center justify-center border border-white/10 text-white/40 hover:text-accent hover:border-accent/40 transition-colors duration-200 rounded-sm text-sm font-mono"
        aria-label={isRunning ? "Pause timer" : "Resume timer"}
      >
        {isRunning ? "⏸" : "▶"}
      </button>
    </div>
  );
});
SessionTimer.displayName = "SessionTimer";

// ─── HUD ──────────────────────────────────────────────────────────────────────

type HUDProps = {
  currentIndex: number;
  progressValue: number;
  isHidden: boolean;
};

const PresentationHUD = memo(({ currentIndex, progressValue, isHidden }: HUDProps) => (
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
        <div className="px-3 py-1 bg-white/5 border border-white/10">
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
            [?] Keys
          </span>
        </div>
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

// ─── Keyboard Reference Overlay ───────────────────────────────────────────────

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
      {KEYS.map(({ key, action }) => (
        <div key={key} className="flex justify-between items-center">
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

// ─── Main Presentation Component ─────────────────────────────────────────────

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [isDeepDiveActive, setIsDeepDiveActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const uiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Evidence card is driven by subStep, not a timer
  const showEvidence = currentIndex === 2 && subStep >= 1 && !isDeepDiveActive;

  // ── Navigation with sub-step awareness ──────────────────────────────────────

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= CHAPTERS.length) return;
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
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
      setCurrentIndex(index);
      setSubStep(0);
      setIsDeepDiveActive(false);
    }
  }, []);

  // ── Deep Dive — plays static MP3 (bulletproof), falls back to live TTS ─────

  const handleDeepDive = useCallback(async () => {
    setIsDeepDiveActive(true);
    setIsSpeaking(true);

    const audio = audioRef.current;
    if (!audio) {
      setIsSpeaking(false);
      return;
    }

    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);

    // Try the pre-generated static file first
    audio.src = BLUEPRINT_AUDIO_URL;
    try {
      await audio.play();
    } catch {
      // Static file not found or blocked — try live TTS as fallback
      try {
        const { generateAssistantSpeech } = await import("@/ai/flows/tts-flow");
        const NARRATION =
          "Hi Fredrik. Of course I can explain the diagram for you. " +
          "This is the five-phase swarm architecture we built during the hackathon. " +
          "Phase one starts with a parallel multi-modal scraper — the channel mapper and Instagram scraper agent pull social data at scale. " +
          "Phase two fans out into parallel research. A product identifier prices items, while affiliate mappers, barter investigators, and donation mappers each handle their speciality — all running simultaneously. " +
          "Phase three is the risk assessor. It analyses all previous findings without any search tools, purely reasoning over what the other agents discovered. " +
          "Phase four is where it gets interesting. A follow-up planner creates a JSON task plan, and a dynamic parallel research executor spawns Worker 1 through Worker N on demand. " +
          "And finally, phase five — the report synthesizer produces a complete Swedish compliance report with proper citations. " +
          "What used to take analysts days now happens in minutes.";
        const response = await generateAssistantSpeech({ text: NARRATION });
        audio.src = response.mediaUrl;
        await audio.play();
      } catch {
        setIsSpeaking(false);
      }
    }
  }, []);

  const handleCloseDeepDive = useCallback(() => {
    setIsDeepDiveActive(false);
    setIsSpeaking(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  // ── Mouse-idle HUD auto-hide ─────────────────────────────────────────────────

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

  // ── Keyboard Stage Controls ──────────────────────────────────────────────────

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
          if (isDeepDiveActive) handleCloseDeepDive();
          if (showKeyboard) setShowKeyboard(false);
          break;

        case "b":
        case "B":
          if (!isDeepDiveActive && currentIndex === 2) {
            setShowKeyboard(false);
            handleDeepDive();
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
          setShowKeyboard((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, subStep, isDeepDiveActive, showKeyboard, advanceForward, goBack, handleDeepDive, handleCloseDeepDive]);

  // ── Derived ───────────────────────────────────────────────────────────────────

  const progressValue = useMemo(
    () => ((currentIndex + 1) / CHAPTERS.length) * 100,
    [currentIndex]
  );

  const hudHidden = isUIHidden || isDeepDiveActive;

  // ── Render ────────────────────────────────────────────────────────────────────

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

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 1 — PROLOGUE
      ──────────────────────────────────────────────────────────────────────── */}
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
        <p className="text-white/35 text-sm font-mono tracking-[0.7em] uppercase">
          Agentic AI · Swedish Tax Agency · Google
        </p>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 2 — THE VISION
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={1}
        chapterName="The Vision"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[1]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "tax-agency-bg")?.imageUrl ?? ""}
        contentClassName="space-y-10"
      >
        <div className="relative">
          <Cpu className="h-16 w-16 text-accent mx-auto" aria-hidden="true" />
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight">
          The Bold Mission
        </h2>
        <p className="text-xl md:text-3xl font-light text-white/75 max-w-4xl mx-auto leading-relaxed [text-wrap:balance]">
          Could we build solutions where{" "}
          <span className="text-accent font-semibold italic">
            multiple AI agents collaborate
          </span>{" "}
          to solve real problems — in just two days, without prior preparation?
        </p>
        <p className="text-[10px] font-mono tracking-[0.6em] uppercase text-white/25">
          We weren't building for perfection. We were building to understand.
        </p>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 3 — THE SWARM (Team Alpha)
          Sub-step 0: slide content stagger in
          Sub-step 1: evidence card slides in (press → to reveal)
          Press B: Technical Blueprint overlay with narration
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={2}
        chapterName="The Swarm"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[2]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "agent-bg")?.imageUrl ?? ""}
        contentClassName="space-y-8 relative w-full pt-14"
      >
        <header className="space-y-4">
          <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
            Case Study — Team Alpha
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
            The Influencer Swarm
          </h2>
        </header>

        <div className="flex items-center justify-center gap-12">
          <div className="text-center">
            <span className="block text-5xl font-black text-accent">10,000+</span>
            <span className="text-[10px] uppercase tracking-widest text-white/35 font-bold mt-1 block">
              Influencers in Sweden
            </span>
          </div>
          <div className="w-px h-14 bg-white/10" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-5xl font-black text-white">48h</span>
            <span className="text-[10px] uppercase tracking-widest text-white/35 font-bold mt-1 block">
              Build Time
            </span>
          </div>
          <div className="w-px h-14 bg-white/10" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-5xl font-black text-accent">5</span>
            <span className="text-[10px] uppercase tracking-widest text-white/35 font-bold mt-1 block">
              Agents in the Swarm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
          {[
            {
              title: "Multi-Modal Scraper",
              desc: "Scans social feeds across platforms to surface undeclared collaborations and gifts.",
              accent: true,
            },
            {
              title: "Valuation Agent",
              desc: "Identifies luxury items in video content and estimates real market value.",
              accent: false,
            },
            {
              title: "Risk Profiler",
              desc: "Consolidates data into human-ready compliance profiles with recommended actions.",
              accent: false,
            },
          ].map((card) => (
            <div
              key={card.title}
              className={cn(
                "p-7 bg-white/5 border border-white/10 text-left",
                card.accent ? "border-t-accent border-t-2" : "border-t-white/20 border-t-2"
              )}
            >
              <h3 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">
                {card.title}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleDeepDive}
            className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
            aria-label="Open Technical Swarm Blueprint"
          >
            <Info className="mr-2 h-4 w-4" aria-hidden="true" />
            Technical Blueprint
            <Volume2
              className={cn(
                "ml-2 h-4 w-4 transition-colors duration-200",
                isSpeaking && "animate-bounce text-white"
              )}
              aria-hidden="true"
            />
          </Button>
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 font-mono text-[9px] text-white/20 tracking-widest">
            B
          </kbd>
        </div>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 4 — THE PEDAGOGY (Team Bravo)
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={3}
        chapterName="The Pedagogy"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[3]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "bravo-bg")?.imageUrl ?? ""}
        contentClassName="space-y-10 w-full max-w-5xl mx-auto px-6 pt-14"
      >
        <div className="space-y-3">
          <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
            Case Study — Team Bravo
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
            The Knowledge Split
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 w-full">
          <div className="p-10 bg-card text-center">
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">
              The "What"
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">Official Regulations</h3>
            <p className="text-white/35 text-sm italic leading-relaxed">
              Excellent accuracy. Pure statutory facts.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[9px] text-green-400 uppercase tracking-widest font-bold">
                High Trust
              </span>
            </div>
          </div>
          <div className="p-10 bg-card text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <AlertTriangle className="text-red-500 h-4 w-4 animate-pulse" />
            </div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">
              The "How"
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">Practical Guidance</h3>
            <p className="text-white/35 text-sm italic leading-relaxed">
              High risk of hallucination. Confident but wrong.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[9px] text-red-400 uppercase tracking-widest font-bold">
                Verify Always
              </span>
            </div>
          </div>
        </div>

        <p className="text-2xl md:text-4xl font-light text-white italic max-w-3xl mx-auto leading-snug [text-wrap:balance]">
          "Skatti… you're actually{" "}
          <span className="text-accent font-bold underline decoration-accent/30 underline-offset-8">
            making that up.
          </span>
          "
        </p>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 5 — THE AUTOMATION (Team Delta)
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={4}
        chapterName="The Automation"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[4]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "delta-bg")?.imageUrl ?? ""}
        contentClassName="space-y-10 w-full max-w-5xl mx-auto pt-14"
      >
        <div className="space-y-3">
          <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
            Case Study — Team Delta
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
            Risk Analysis Swarm
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { Icon: FileText, label: "Annual Reports" },
            { Icon: Database, label: "SCB Statistics" },
            { Icon: Users, label: "Public Registry" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="p-6 bg-white/5 border border-white/10 text-center"
            >
              <Icon className="h-5 w-5 text-accent mb-3 mx-auto" aria-hidden="true" />
              <span className="text-[10px] text-white/45 uppercase tracking-[0.3em] font-bold">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full px-10 py-8 bg-white/5 border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex justify-between items-end">
                <span className="text-[9px] uppercase tracking-widest text-white/35 font-bold">
                  Human Analyst
                </span>
                <span className="text-xs font-mono text-white/50">Hours of manual work</span>
              </div>
              <Progress value={100} className="h-1 bg-white/10" />
            </div>
            <div className="flex flex-col items-center shrink-0 gap-1">
              <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="text-[8px] uppercase tracking-[0.3em] text-accent font-bold">
                VS
              </span>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <div className="flex justify-between items-end">
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold">
                  Agent Swarm
                </span>
                <span className="text-xs font-mono text-accent">Seconds of AI reasoning</span>
              </div>
              <Progress value={3} className="h-1 bg-white/10" />
            </div>
          </div>
          <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.5em] font-mono border-t border-white/10 pt-4">
            Serial + parallel agent execution · callback orchestration
          </p>
        </div>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 6 — THE VERDICT
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={5}
        chapterName="The Verdict"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[5]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "winner-bg")?.imageUrl ?? ""}
      >
        <div className="relative mb-6">
          <div className="absolute -inset-8 bg-accent/15 blur-3xl rounded-full" />
          <div className="absolute -inset-4 bg-accent/10 blur-xl rounded-full" />
          <Trophy className="relative h-24 w-24 text-accent mx-auto drop-shadow-[0_0_24px_rgba(100,200,230,0.6)]" aria-hidden="true" />
        </div>
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic mb-8">
          Team Alpha Wins
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-xl md:text-3xl font-light text-white/80 leading-snug [text-wrap:balance]">
            "Demonstrates how the power of multi-agent systems can be used in a{" "}
            <span className="text-accent font-semibold">powerful yet playful way</span>."
          </p>
          <div className="h-px w-20 bg-accent mx-auto" aria-hidden="true" />
          <p className="text-white/30 text-[10px] uppercase tracking-[0.6em] font-mono">
            Crime prevention · Valuations · Dynamic orchestration
          </p>
        </div>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 7 — THE WISDOM
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={6}
        chapterName="The Wisdom"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[6]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "takeaway-bg")?.imageUrl ?? ""}
        contentClassName="space-y-12 max-w-5xl mx-auto px-6 w-full"
      >
        <div className="space-y-4">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[1em] font-mono">
            The Core Insight
          </span>
          <p className="text-3xl md:text-5xl font-light text-white italic leading-tight [text-wrap:balance]">
            "Agents are not just technology.
            <br />
            They're{" "}
            <span className="text-accent font-bold not-italic">
              teammates without judgment.
            </span>
            <br />
            They need boundaries, orchestration, and patience."
          </p>
        </div>

        <div className="w-full pt-8 border-t border-white/10">
          <p className="text-[9px] font-mono uppercase tracking-[0.6em] text-white/25 mb-6">
            The progression we are on
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 w-full">
            <div className="evolution-step flex-1 p-6 bg-white/5 border border-white/10 text-center">
              <MessageSquare className="h-5 w-5 text-white/30 mx-auto mb-2" />
              <span className="block text-white/50 font-light text-base">AI Chat</span>
              <span className="block text-[9px] text-white/20 uppercase tracking-widest mt-1">
                Reactive Q&A
              </span>
            </div>
            <div className="evolution-step flex items-center justify-center px-2 md:px-3">
              <ArrowRight className="h-5 w-5 text-accent/50 rotate-90 md:rotate-0" aria-hidden="true" />
            </div>
            <div className="evolution-step flex-1 p-6 bg-accent/15 border border-accent/40 text-center relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent text-[8px] font-bold text-black uppercase tracking-widest">
                Now
              </div>
              <Cpu className="h-5 w-5 text-accent mx-auto mb-2" />
              <span className="block text-white font-bold text-base">AI Assistants</span>
              <span className="block text-[9px] text-accent/60 uppercase tracking-widest mt-1">
                Context-aware help
              </span>
            </div>
            <div className="evolution-step flex items-center justify-center px-2 md:px-3">
              <ArrowRight className="h-5 w-5 text-accent rotate-90 md:rotate-0" aria-hidden="true" />
            </div>
            <div className="evolution-step flex-1 p-6 bg-white/10 border-2 border-white/30 text-center">
              <Rocket className="h-5 w-5 text-white mx-auto mb-2" />
              <span className="block text-white font-black text-base italic tracking-tight">
                AI Coworkers
              </span>
              <span className="block text-[9px] text-white/40 uppercase tracking-widest mt-1">
                Autonomous · Orchestrated
              </span>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* ────────────────────────────────────────────────────────────────────────
          SLIDE 8 — THE FUTURE
      ──────────────────────────────────────────────────────────────────────── */}
      <PresentationSection
        sectionIndex={7}
        chapterName="The Future"
        scrollRootRef={containerRef}
        onSectionActiveChange={handleSectionActiveChange}
        videoUrl={LOCAL_VIDEOS[7]}
        fallbackImageUrl={PlaceHolderImages.find((img) => img.id === "hero-bg")?.imageUrl ?? ""}
        contentClassName="space-y-16 max-w-5xl mx-auto px-6 w-full"
      >
        <div className="space-y-6">
          <div className="relative inline-block mx-auto">
            <Rocket className="h-10 w-10 text-accent mx-auto" aria-hidden="true" />
            <div className="absolute inset-0 bg-accent/20 blur-2xl" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
            Skatteverket 3.0
          </h2>
          <p className="text-lg md:text-xl font-light text-white/65 leading-relaxed max-w-3xl mx-auto [text-wrap:balance]">
            Through{" "}
            <span className="text-accent font-semibold italic">'Kraftsamling AI'</span>
            , we are building the foundation — culture, legal compliance, and
            entirely new ways of working.
          </p>
        </div>

        <div className="relative pt-12 border-t border-white/10">
          <Sparkles
            className="absolute -top-5 left-1/2 -translate-x-1/2 h-8 w-8 text-accent/30"
            aria-hidden="true"
          />
          <blockquote>
            <p className="text-3xl md:text-5xl font-black text-white tracking-tighter italic leading-tight [text-wrap:balance]">
              "The future is already here —
              <br />
              it's just not{" "}
              <span className="text-accent">evenly distributed.</span>"
            </p>
            <footer className="mt-8 text-white/25 font-mono text-xs tracking-[0.5em] uppercase">
              — William Gibson
            </footer>
          </blockquote>
        </div>
      </PresentationSection>
    </main>

    {/* ══════════════════════════════════════════════════════════════════════
        OVERLAYS — rendered OUTSIDE <main> so they are not children of
        the scroll container. This guarantees correct fixed positioning
        and z-index stacking on all browsers.
    ══════════════════════════════════════════════════════════════════════ */}

    {/* ── Evidence card — appears when presenter presses → on Swarm slide ── */}
    <aside
      className={cn(
        "fixed right-12 bottom-12 w-80 p-5 bg-card border border-white/10 shadow-2xl transition-[opacity,transform] duration-700 ease-out z-[90] will-change-[opacity,transform]",
        showEvidence
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      )}
      aria-label="Case evidence card"
    >
      <div className="relative h-40 w-full bg-muted mb-3 overflow-hidden">
        <img
          src="/images/influencerJail.png"
          alt="Swedish influencer sentenced for tax evasion"
          className="w-full h-full object-cover"
          width={320}
          height={160}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2.5 left-2.5">
          <span className="bg-red-500 text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-tighter">
            Real Case
          </span>
        </div>
      </div>
      <h4 className="text-white font-black text-sm mb-1.5 tracking-tight">
        He went to jail.
      </h4>
      <p className="text-white/40 text-[10px] leading-relaxed italic">
        Our swarm could have nudged him months earlier.
      </p>
    </aside>

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
        className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white bg-white/10 p-3 border border-white/20 transition-all duration-200 hover:scale-105 hover:border-white/40"
        aria-label="Close blueprint (Esc)"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Left sidebar — fixed width, full height, scrollable if needed */}
      <div
        className={cn(
          "w-72 shrink-0 flex flex-col justify-center gap-5 px-8 py-10 border-r border-white/10 overflow-y-auto",
          isDeepDiveActive && "deep-dive-active"
        )}
      >
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

        <div className="space-y-4">
          {[
            { title: "Data Gathering",         desc: "Channel mapping & social scraping" },
            { title: "Parallel Research",       desc: "Pricing, affiliates, barter, donations — simultaneously" },
            { title: "Risk Assessment",         desc: "Reason over all findings, zero search tools" },
            { title: "Follow-up Investigation", desc: "JSON task plan spawns N dynamic workers" },
            { title: "Compliance Report",       desc: "Swedish report with verified citations" },
          ].map((item, i) => (
            <div key={i} className="deep-dive-phase flex items-start gap-3">
              <div className="shrink-0 w-7 h-7 bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono text-xs">
                {i + 1}
              </div>
              <div className="min-w-0">
                <span className="block text-white font-bold text-sm leading-snug">{item.title}</span>
                <span className="block text-white/30 text-[9px] uppercase tracking-widest mt-0.5 leading-snug">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-0.5 h-4 bg-accent animate-pulse"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em]">
              AI Narrating…
            </span>
          </div>
        )}
      </div>

      {/* Right panel — fills remaining width and full height, image centred */}
      <div className="flex-1 flex items-center justify-center p-6 min-w-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
          <img
            src="/images/flowInfluencer.png"
            alt="Five-phase swarm architecture diagram"
            className="relative max-w-full max-h-full w-auto h-auto object-contain border border-white/10 shadow-2xl"
            style={{ maxHeight: "calc(100vh - 48px)" }}
          />
        </div>
      </div>
    </div>
    </>
  );
}
