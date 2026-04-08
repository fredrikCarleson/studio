
"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Cpu, MessageSquare, Workflow, Trophy, Users, AlertTriangle, FileText, Database, Clock, X, Info, Volume2, Sparkles, Rocket, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateAssistantSpeech } from "@/ai/flows/tts-flow";

const CHAPTERS = [
  "Prologue",
  "The Vision",
  "The Swarm",
  "The Pedagogy",
  "The Automation",
  "The Verdict",
  "The Wisdom",
  "The Future"
];

const LOCAL_VIDEOS = [
  "/videos/Sunrise_over_Stockholm_202604071643.mp4",
  "/videos/Modern_tech_office_202604071647.mp4",
  "/videos/AI_agents_collaborating_202604071648.mp4",
  "/videos/Digital_documents_sorted_202604071650.mp4",
  "/videos/Digital_reports_financial_202604071757.mp4",
  "/videos/Golden_particles_converging_202604071759.mp4",
  "/videos/Geometric_shapes_moving_202604071759.mp4",
  "/videos/Digital_horizon_leading_202604071800.mp4",
];

const ARCHITECTURE_EXPLANATION = "This is our agentic swarm architecture. Phase 1 begins with a parallel multi-modal scraper. In phase 2, we fan out to specialized evaluation agents. Phase 3 uses a JSON task plan to dynamically spawn workers. Finally, phase 5 converges into a structured Swedish compliance report.";

// Sub-components to prevent full page re-renders
const PresentationHUD = memo(({ 
  currentIndex, 
  progressValue, 
  isUIHidden, 
  isDeepDiveActive, 
  timeLeft, 
  isTimerRunning, 
  setIsTimerRunning 
}: any) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 w-full z-[80] p-8 flex justify-between items-start transition-all duration-700 will-change-transform",
      (isUIHidden || isDeepDiveActive) ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100 translate-y-0"
    )}>
      <div className="flex flex-col gap-2 w-72">
        <div className="flex justify-between items-end mb-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60">Chapter {currentIndex + 1}</span>
            <span className="text-sm font-bold tracking-tight text-white uppercase">{CHAPTERS[currentIndex]}</span>
          </div>
          <span className="text-[10px] font-mono text-white/40">{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-[1px] bg-white/10" aria-label="Presentation progress" />
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-6 px-6 py-3 bg-black/60 backdrop-blur-xl rounded-sm border border-white/10 shadow-2xl">
          <div className="flex flex-col items-end border-r border-white/10 pr-6 mr-1">
            <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">Session Timer</span>
            <span className={cn("font-mono text-2xl font-light tracking-tighter", timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white")}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="h-10 w-10 rounded-full border border-white/10 p-0 text-white/40 hover:text-accent transition-all"
            aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
          >
            {isTimerRunning ? "||" : "▶"}
          </Button>
        </div>
        <div className="px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-sm">
          <span className="text-[9px] font-bold tracking-[0.5em] text-accent uppercase">BETA 1.0</span>
        </div>
      </div>
    </div>
  );
});
PresentationHUD.displayName = "PresentationHUD";

const NavigationTimeline = memo(({ currentIndex, scrollToSection, isUIHidden, isDeepDiveActive }: any) => (
  <nav className={cn(
    "fixed left-12 top-1/2 -translate-y-1/2 z-[80] flex flex-col gap-8 transition-all duration-700 will-change-transform",
    (isUIHidden || isDeepDiveActive) ? "opacity-0 pointer-events-none -translate-x-8" : "opacity-100 translate-x-0"
  )} aria-label="Slide navigation">
    {CHAPTERS.map((name, i) => (
      <button
        key={i}
        onClick={() => scrollToSection(i)}
        className="group relative flex items-center"
        aria-label={`Go to ${name}`}
        aria-current={currentIndex === i ? "step" : undefined}
      >
        <div className={cn(
          "w-px transition-all duration-700",
          currentIndex === i ? "h-12 bg-accent" : "h-6 bg-white/10 group-hover:bg-white/30"
        )} />
        <div className={cn(
          "absolute left-4 px-2 py-1 transition-all duration-500 rounded-sm",
          currentIndex === i ? "opacity-100 translate-x-0 bg-accent/10 border-l-2 border-accent" : "opacity-0 -translate-x-4 pointer-events-none"
        )}>
          <span className="text-[9px] uppercase tracking-[0.4em] text-accent whitespace-nowrap font-bold">
            {name}
          </span>
        </div>
      </button>
    ))}
  </nav>
));
NavigationTimeline.displayName = "NavigationTimeline";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isDeepDiveActive, setIsDeepDiveActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const uiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const totalSections = CHAPTERS.length;

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections) return;
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth"
      });
      setCurrentIndex(index);
    }
  }, [totalSections]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      if (index !== currentIndex) {
        setCurrentIndex(index);
        if (index === 1 && !isTimerRunning) setIsTimerRunning(true);
        setIsDeepDiveActive(false);
        if (index === 2) {
          const t = setTimeout(() => setShowEvidence(true), 2500);
          return () => clearTimeout(t);
        } else {
          setShowEvidence(false);
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, isTimerRunning]);

  const handleDeepDive = async () => {
    setIsDeepDiveActive(true);
    setIsSpeaking(true);
    try {
      const response = await generateAssistantSpeech({ text: ARCHITECTURE_EXPLANATION });
      if (audioRef.current) {
        audioRef.current.src = response.mediaUrl;
        audioRef.current.play();
        audioRef.current.onended = () => setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Assistant speech failed:", error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsUIHidden(false);
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
      uiTimerRef.current = setTimeout(() => setIsUIHidden(true), 5000);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    };
  }, []);

  const progressValue = useMemo(() => ((currentIndex + 1) / totalSections) * 100, [currentIndex, totalSections]);

  return (
    <main ref={containerRef} className="snap-container relative bg-black selection:bg-accent/30" role="presentation">
      <div className="film-grain" aria-hidden="true" />
      <audio ref={audioRef} hidden />

      <PresentationHUD 
        currentIndex={currentIndex}
        progressValue={progressValue}
        isUIHidden={isUIHidden}
        isDeepDiveActive={isDeepDiveActive}
        timeLeft={timeLeft}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
      />

      <NavigationTimeline 
        currentIndex={currentIndex}
        scrollToSection={scrollToSection}
        isUIHidden={isUIHidden}
        isDeepDiveActive={isDeepDiveActive}
      />

      {/* Slide 1: Prologue */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[0]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
        priority
      >
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white max-w-5xl leading-[0.9] mb-8">
          Hackathon. <br/>
          <span className="text-accent italic">Two days.</span> <br/>
          Three teams. <br/>
          Fifteen brains.
        </h1>
        <p className="text-white/40 text-sm md:text-base font-mono tracking-[0.6em] uppercase">
          Agentic AI at the Swedish Tax Agency
        </p>
      </PresentationSection>

      {/* Slide 2: Mission */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[1]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "tax-agency-bg")?.imageUrl || ""}
      >
        <div className="space-y-12">
          <div className="relative inline-block">
             <Cpu className="h-20 w-20 text-accent mx-auto animate-pulse" aria-hidden="true" />
             <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase">The Bold Mission</h2>
          <p className="text-xl md:text-3xl font-light text-white/80 max-w-4xl mx-auto leading-tight">
            Could we build solutions where <span className="text-accent font-semibold italic">multiple AI agents</span> collaborate to solve real problems—without prior preparation?
          </p>
        </div>
      </PresentationSection>

      {/* Slide 3: Team Alpha - Swarm & Nudge */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[2]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "agent-bg")?.imageUrl || ""}
      >
        <div className="space-y-6 relative w-full">
          <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-sm text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
            Case Study: Team Alpha
          </div>
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">The Influencer Swarm</h2>
          
          <div className="flex items-center justify-center gap-12 mt-4">
            <div className="text-center">
              <span className="block text-5xl font-bold text-accent">10,000+</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Market Size</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <span className="block text-5xl font-bold text-white">48h</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Build Time</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12 px-6">
            <div className="p-8 bg-white/5 border border-white/10 text-left border-t-accent border-t-2">
              <h3 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">Multi-Modal Scraper</h3>
              <p className="text-white/60 text-xs leading-relaxed">Scanning feeds to identify "undeclared" collaborations and gifts.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 text-left border-t-white/20 border-t-2">
              <h3 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">Valuation Agent</h3>
              <p className="text-white/60 text-xs leading-relaxed">Identifying luxury items in YouTube videos and estimating market value.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 text-left border-t-white/20 border-t-2">
              <h3 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">Risk Profiler</h3>
              <p className="text-white/60 text-xs leading-relaxed">Consolidating social data, valuation, and registries into human-ready profiles.</p>
            </div>
          </div>

          <div className="mt-12">
            <Button 
              variant="outline" 
              onClick={handleDeepDive}
              className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
              aria-label="View Technical Swarm Blueprint"
            >
              <Info className="mr-2 h-4 w-4" aria-hidden="true" />
              Technical Swarm Blueprint
              <Volume2 className={cn("ml-2 h-4 w-4 transition-all", isSpeaking && "animate-bounce text-white")} aria-hidden="true" />
            </Button>
          </div>

          {/* Floating Nudge Evidence Overlay */}
          <aside className={cn(
            "fixed right-12 bottom-12 w-80 p-6 bg-card border border-white/10 rounded-sm shadow-2xl transition-all duration-1000 transform z-[50]",
            showEvidence && !isDeepDiveActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
          )} aria-label="Nudge Case Example">
            <div className="relative h-48 w-full bg-muted mb-4 overflow-hidden rounded-sm">
              <img 
                src="/images/influencerJail.png" 
                alt="Case Evidence showing tax legal consequences" 
                className="w-full h-full object-cover"
                width={320}
                height={192}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-red-500 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Case Example</span>
              </div>
            </div>
            <h4 className="text-white font-bold text-sm mb-2">The "Nudge" Strategy</h4>
            <p className="text-white/50 text-[10px] leading-relaxed italic">
              "Imagine if we nudged this influencer early. Shifting from reactive correction to proactive compliance could prevent legal crises."
            </p>
          </aside>
        </div>

        {/* Technical Swarm Architecture Deep Dive Overlay */}
        <div className={cn(
          "fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 md:p-12 transition-all duration-700",
          isDeepDiveActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
        )} role="dialog" aria-labelledby="blueprint-title">
          <button 
            onClick={() => {
              setIsDeepDiveActive(false);
              if (audioRef.current) audioRef.current.pause();
            }}
            className="absolute top-12 right-12 z-[110] text-white/60 hover:text-white bg-white/10 p-4 rounded-full border border-white/20 transition-all hover:scale-110"
            aria-label="Close deep dive"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8 text-left">
                <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/40 rounded-sm text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
                  Technical Swarm Architecture
                </div>
                <h2 id="blueprint-title" className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-tight">Five-Phase Execution</h2>
                <div className="space-y-4">
                  {[
                    { title: "Multi-Modal Scraper", desc: "Phase 1: High-throughput parallel collection" },
                    { title: "Valuation Swarm", desc: "Phase 2: Fan-out to specialized pricing models" },
                    { title: "Dynamic Workers", desc: "Phase 3: Automated spawning based on task plans" },
                    { title: "Registry Synthesis", desc: "Phase 4: Cross-referencing legal entity data" },
                    { title: "Compliance Output", desc: "Phase 5: Final human-readable Swedish reports" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 group">
                       <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-mono text-sm">
                         {i + 1}
                       </div>
                       <div>
                         <span className="block text-white font-semibold text-xl">{item.title}</span>
                         <span className="block text-white/40 text-xs uppercase tracking-widest">{item.desc}</span>
                       </div>
                    </div>
                  ))}
                </div>
                
                {isSpeaking && (
                  <div className="pt-10 flex items-center gap-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 bg-accent animate-pulse" style={{ animationDelay: `${i*100}ms` }} />)}
                    </div>
                    <span className="text-accent font-mono text-xs uppercase tracking-[0.4em]">AI Assistant Narrating...</span>
                  </div>
                )}
             </div>
             
             <div className="relative">
                <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full" />
                <div className="relative rounded-lg border border-white/10 bg-black/50 overflow-hidden shadow-2xl">
                   <img 
                    src="https://picsum.photos/seed/system-diagram-3/1200/900" 
                    alt="System Architecture technical diagram" 
                    className="w-full h-auto opacity-70 grayscale"
                    data-ai-hint="system diagram"
                    width={1200}
                    height={900}
                   />
                </div>
             </div>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 4: Team Bravo - The Pedagogy */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[3]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "bravo-bg")?.imageUrl || ""}
      >
        <div className="space-y-12 w-full max-w-6xl mx-auto px-6">
          <MessageSquare className="h-16 w-16 text-accent mx-auto" aria-hidden="true" />
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight">The Knowledge Split</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 border border-white/10 p-2 rounded-sm">
            <div className="p-12 text-center border-r border-white/10 hover:bg-white/5 transition-all">
              <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">The "What"</span>
              <h3 className="text-2xl font-bold text-white mb-4">Official Regulations</h3>
              <p className="text-white/40 text-sm italic">"Excellent accuracy. Pure facts. Static rules."</p>
            </div>
            <div className="p-12 text-center relative overflow-hidden group hover:bg-red-500/5 transition-all">
              <div className="absolute top-4 right-4 animate-pulse">
                <AlertTriangle className="text-red-500 h-4 w-4" />
              </div>
              <span className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">The "How"</span>
              <h3 className="text-2xl font-bold text-white mb-4">Practical Pedagogy</h3>
              <p className="text-white/40 text-sm italic">"High risk of hallucination. Making things up."</p>
            </div>
          </div>

          <p className="text-2xl md:text-4xl font-light text-white italic max-w-4xl mx-auto">
            "Skatti… you're actually <span className="text-accent font-bold underline decoration-accent/30 underline-offset-8">making that up.</span>"
          </p>
        </div>
      </PresentationSection>

      {/* Slide 5: Team Delta - Automation */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[4]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "delta-bg")?.imageUrl || ""}
      >
        <div className="space-y-12">
          <Workflow className="h-16 w-16 text-accent mx-auto" aria-hidden="true" />
          <h2 className="text-4xl md:text-7xl font-bold text-white">Risk Analysis Swarm</h2>
          
          <div className="flex flex-col items-center gap-6 mt-8 max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {[
                { icon: FileText, label: "Annual Reports" },
                { icon: Database, label: "SCB Statistics" },
                { icon: Users, label: "Public Registry" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-sm text-center">
                  <item.icon className="h-6 w-6 text-accent mb-4 mx-auto" aria-hidden="true" />
                  <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold">{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row w-full items-center gap-8 mt-12 px-12 py-8 bg-white/5 border border-white/10 rounded-sm">
              <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Human Compilation</span>
                  <span className="text-xs font-mono text-white/60">~Hours of Manual Work</span>
                </div>
                <Progress value={100} className="h-1 bg-white/10" aria-label="Human speed baseline" />
              </div>
              <div className="flex flex-col items-center shrink-0">
                <Clock className="h-6 w-6 text-accent animate-pulse" aria-hidden="true" />
                <span className="text-[8px] uppercase tracking-[0.3em] text-accent font-bold mt-2">VS</span>
              </div>
              <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] uppercase tracking-widest text-accent font-bold">Agent Swarm</span>
                  <span className="text-xs font-mono text-accent">~Seconds of AI Reasoning</span>
                </div>
                <Progress value={5} className="h-1 bg-white/10" aria-label="Agent swarm speed" />
              </div>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 6: Verdict */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[5]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "winner-bg")?.imageUrl || ""}
      >
        <Trophy className="h-20 w-20 text-accent mx-auto mb-8 animate-bounce" aria-hidden="true" />
        <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-6 italic">The Winner: Team Alpha</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-2xl md:text-4xl font-light text-white leading-snug">
            Agents thrive when given <span className="text-accent font-bold">roles, responsibilities, and peers.</span>
          </p>
          <div className="h-px w-24 bg-accent mx-auto" aria-hidden="true" />
          <p className="text-white/40 text-[10px] uppercase tracking-[0.6em] font-mono">Crime prevention • Valuations • Swarm Orchestration</p>
        </div>
      </PresentationSection>

      {/* Slide 7: Wisdom & Opportunity */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[6]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "takeaway-bg")?.imageUrl || ""}
      >
        <div className="space-y-12 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-4">
            <h3 className="text-accent text-xs font-bold uppercase tracking-[1em]">The Core Insight</h3>
            <p className="text-2xl md:text-5xl font-light text-white italic leading-tight max-w-5xl mx-auto">
              "Agents are not just technology. They're <span className="text-accent font-bold">digital coworkers.</span> They need structure, verification, and patience."
            </p>
          </div>
          
          <div className="pt-12 border-t border-white/10 w-full flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center w-full">
              <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                <span className="text-white/80 text-lg font-light">AI Chat</span>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="text-accent h-6 w-6 rotate-90 md:rotate-0" aria-hidden="true" />
              </div>
              <div className="p-6 bg-accent/20 border border-accent/40 rounded-sm">
                <span className="text-white font-bold text-lg">AI Assistants</span>
              </div>
              <div className="flex justify-center">
                 <ArrowRight className="text-accent h-6 w-6 rotate-90 md:rotate-0" aria-hidden="true" />
              </div>
              <div className="p-6 bg-white/10 border border-white/20 rounded-sm">
                <span className="text-white font-black text-lg italic tracking-tighter">AI Coworkers</span>
              </div>
            </div>
            <p className="mt-8 text-white/30 text-[9px] font-mono tracking-widest uppercase">Transitioning to Deep Workflow Integration</p>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 8: Horizon - The Final Message */}
      <PresentationSection 
        videoUrl={LOCAL_VIDEOS[7]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
      >
        <div className="max-w-5xl mx-auto space-y-12 px-6 text-center">
          <div className="space-y-6">
            <Rocket className="h-10 w-10 text-accent mx-auto" aria-hidden="true" />
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">Skatteverket 3.0</h2>
            <p className="text-lg md:text-2xl font-light text-white/80 leading-relaxed max-w-4xl mx-auto">
              Through <span className="text-accent font-semibold italic">'Kraftsamling AI'</span>, we are building the foundation—focusing on <span className="text-white font-bold">culture, legal compliance, and new ways of working.</span>
            </p>
          </div>

          <div className="pt-12 border-t border-white/10 relative">
             <Sparkles className="absolute -top-10 left-1/2 -translate-x-1/2 h-8 w-8 text-accent/40" aria-hidden="true" />
             <h3 className="text-3xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
              "The future is already here - <br/>it's just not <span className="text-accent">evenly distributed.</span>"
             </h3>
             <p className="mt-6 text-white/30 font-mono text-xs tracking-[0.4em] uppercase">— William Gibson</p>
          </div>
        </div>
      </PresentationSection>
    </main>
  );
}
