"use client";

import { useState, useEffect, useRef } from "react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, ArrowRight, Cpu, MessageSquare, Workflow, Trophy, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  "Prologue",
  "The Vision",
  "The Swarm",
  "The Pedagogy",
  "The Automation",
  "The Verdict",
  "The Wisdom",
  "The Horizon"
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalSections = CHAPTERS.length;

  const videos = [
    "/videos/Sunrise_over_Stockholm_202604071643.mp4",
    "/videos/Modern_tech_office_202604071647.mp4",
    "/videos/AI_agents_collaborating_202604071648.mp4",
    "/videos/Digital_documents_sorted_202604071650.mp4",
    "/videos/Digital_reports_financial_202604071757.mp4",
    "/videos/Golden_particles_converging_202604071759.mp4",
    "/videos/Geometric_shapes_moving_202604071759.mp4",
    "/videos/Digital_horizon_leading_202604071800.mp4",
  ];

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= totalSections) return;
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth"
      });
      setCurrentIndex(index);
      if (index === 1 && !isTimerRunning) setIsTimerRunning(true);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsUIHidden(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsUIHidden(true), 3000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        scrollToSection(currentIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollToSection(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main ref={containerRef} className="snap-container relative bg-black">
      <div className="film-grain" />

      {/* Stage Monitor HUD */}
      <div className={cn(
        "fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-start transition-opacity duration-1000",
        isUIHidden ? "opacity-0" : "opacity-100"
      )}>
        <div className="flex flex-col gap-2 w-72">
          <div className="flex justify-between items-end mb-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-accent/60">Chapter {currentIndex + 1}</span>
              <span className="text-sm font-bold tracking-tight text-white uppercase">{CHAPTERS[currentIndex]}</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">{Math.round(((currentIndex + 1) / totalSections) * 100)}%</span>
          </div>
          <Progress value={((currentIndex + 1) / totalSections) * 100} className="h-[2px] bg-white/10" />
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-6 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-sm border border-white/10">
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
              className="h-10 w-10 rounded-full border border-white/10 p-0 text-white/40 hover:text-accent transition-all hover:scale-110 active:scale-95"
            >
              {isTimerRunning ? "||" : "▶"}
            </Button>
          </div>
          <div className="px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-sm">
            <span className="text-[9px] font-bold tracking-[0.5em] text-accent uppercase">BETA 1.0</span>
          </div>
        </div>
      </div>

      {/* Navigation Timeline (Scrubber style) */}
      <div className={cn(
        "fixed left-12 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-8 transition-opacity duration-1000",
        isUIHidden ? "opacity-0" : "opacity-100"
      )}>
        {CHAPTERS.map((name, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className="group relative flex items-center"
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
      </div>

      {/* Floating Controls */}
      <div className={cn(
        "fixed bottom-12 right-12 z-50 flex gap-4 transition-all duration-1000",
        isUIHidden ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      )}>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => scrollToSection(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full border-white/10 bg-black/20 backdrop-blur-xl hover:bg-accent hover:border-accent group transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-white group-hover:scale-110" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => scrollToSection(currentIndex + 1)}
          disabled={currentIndex === totalSections - 1}
          className="w-12 h-12 rounded-full border-white/10 bg-black/20 backdrop-blur-xl hover:bg-accent hover:border-accent group transition-all"
        >
          <ArrowRight className="h-5 w-5 text-white group-hover:scale-110" />
        </Button>
      </div>

      {/* Slide 1: Prologue */}
      <PresentationSection 
        videoUrl={videos[0]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
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
        videoUrl={videos[1]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "tax-agency-bg")?.imageUrl || ""}
      >
        <div className="space-y-12">
          <div className="relative inline-block">
             <Cpu className="h-20 w-20 text-accent mx-auto animate-pulse" />
             <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase">The Bold Mission</h2>
          <p className="text-xl md:text-3xl font-light text-white/80 max-w-4xl mx-auto leading-tight">
            Could we build solutions where <span className="text-accent font-semibold italic">multiple AI agents</span> collaborate to solve real problems—without prior preparation?
          </p>
        </div>
      </PresentationSection>

      {/* Slide 3: Team Alpha */}
      <PresentationSection 
        videoUrl={videos[2]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "agent-bg")?.imageUrl || ""}
      >
        <div className="space-y-10">
          <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-sm text-accent text-[10px] font-bold uppercase tracking-[0.4em]">
            Case Study: Team Alpha
          </div>
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">Influencer Risk</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto italic">
            Automating the detection of hidden economies through multi-modal analysis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12 px-6">
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-3xl text-left border-t-accent border-t-2 group hover:bg-white/10 transition-all">
              <span className="text-accent text-3xl font-bold mb-4 block">01</span>
              <h4 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">The Scraper</h4>
              <p className="text-white/60 text-xs leading-relaxed">Scanning feeds multimodally to identify "undeclared" collaborations and gifts.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-3xl text-left border-t-white/20 border-t-2 group hover:bg-white/10 transition-all">
              <span className="text-accent text-3xl font-bold mb-4 block">02</span>
              <h4 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">The Valuation</h4>
              <p className="text-white/60 text-xs leading-relaxed">Identifying luxury watches in YouTube videos and estimating market value instantly.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-3xl text-left border-t-white/20 border-t-2 group hover:bg-white/10 transition-all">
              <span className="text-accent text-3xl font-bold mb-4 block">03</span>
              <h4 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">The Swarm</h4>
              <p className="text-white/60 text-xs leading-relaxed">Agents cross-referencing connections to flag high-risk anomalies for humans.</p>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 4: Team Bravo */}
      <PresentationSection 
        videoUrl={videos[3]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "bravo-bg")?.imageUrl || ""}
      >
        <div className="space-y-12">
          <MessageSquare className="h-16 w-16 text-accent mx-auto" />
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight">Skatti 2.0</h2>
          
          <div className="relative py-12 px-6 bg-accent/5 border-y border-white/10">
            <div className="absolute left-8 top-4 text-9xl text-accent/10 font-serif leading-none">"</div>
            <blockquote className="text-2xl md:text-5xl text-white font-light italic max-w-4xl mx-auto leading-tight relative z-10">
              Skatti… <br/>you're actually <span className="text-accent font-bold">making that up.</span>
            </blockquote>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-16 mt-12 text-left">
            <div className="space-y-4">
              <p className="text-accent font-bold text-[10px] uppercase tracking-[0.4em] border-b border-accent/20 pb-2">The "What" Barrier</p>
              <p className="text-white/70 text-sm leading-relaxed">Official sites explain regulations perfectly, but agents struggle to interpret the rigid 'officialese' for humans.</p>
            </div>
            <div className="space-y-4">
              <p className="text-accent font-bold text-[10px] uppercase tracking-[0.4em] border-b border-accent/20 pb-2">The "How" Risk</p>
              <p className="text-white/70 text-sm leading-relaxed">Unofficial sites explain logic better, but introduce hallucination risks. Human verification remains the anchor.</p>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 5: Team Delta */}
      <PresentationSection 
        videoUrl={videos[4]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "delta-bg")?.imageUrl || ""}
      >
        <div className="space-y-12">
          <Workflow className="h-16 w-16 text-accent mx-auto" />
          <h2 className="text-4xl md:text-7xl font-bold text-white">Kraftsamling: Team Delta</h2>
          
          <div className="flex flex-col items-center gap-6 mt-8 max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-3 gap-4 w-full">
              {["Annual Reports", "SCB Statistics", "Public Registry"].map((item, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 text-[10px] text-white/50 uppercase tracking-[0.3em] rounded-sm backdrop-blur-xl">
                  {item}
                </div>
              ))}
            </div>
            
            <div className="h-16 w-px bg-gradient-to-b from-white/20 to-accent" />
            
            <div className="flex gap-8 items-center bg-black/40 p-6 border border-white/10 rounded-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="px-6 py-3 border border-accent bg-accent/10 rounded-sm text-accent font-bold text-xs tracking-[0.2em] animate-pulse">
                  PARALLEL EXTRACTION
                </div>
                <span className="text-[8px] text-white/40 uppercase">Agents 1-4</span>
              </div>
              <ArrowRight className="text-white/20" />
              <div className="flex flex-col items-center gap-2">
                <div className="px-6 py-3 border border-white/20 bg-white/5 rounded-sm text-white font-bold text-xs tracking-[0.2em]">
                  SERIAL REASONING
                </div>
                <span className="text-[8px] text-white/40 uppercase">Lead Analyst</span>
              </div>
            </div>
            
            <div className="h-16 w-px bg-gradient-to-b from-accent to-white/20" />
            
            <div className="p-10 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-lg w-full text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/30" />
              <h4 className="text-white font-bold mb-4 tracking-[0.5em] uppercase text-xs">Outcome: Holistic Scrutiny</h4>
              <p className="text-white/60 text-lg italic font-light">"What took humans hours to compile was done in minutes—with consistency that doesn't tire."</p>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 6: Verdict */}
      <PresentationSection 
        videoUrl={videos[5]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "winner-bg")?.imageUrl || ""}
      >
        <Trophy className="h-20 w-20 text-accent mx-auto mb-8" />
        <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-6 italic">The Winner: Alpha</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-2xl md:text-4xl font-light text-white leading-snug">
            Multi-agent systems show their power when they are given <span className="text-accent font-bold">roles, responsibilities, and peers.</span>
          </p>
          <div className="h-[2px] w-24 bg-accent mx-auto" />
          <p className="text-white/40 text-[10px] uppercase tracking-[0.6em] font-mono">Potential: Crime prevention and stolen goods analysis</p>
        </div>
      </PresentationSection>

      {/* Slide 7: Wisdom */}
      <PresentationSection 
        videoUrl={videos[6]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "takeaway-bg")?.imageUrl || ""}
      >
        <div className="space-y-16">
          <h3 className="text-accent text-sm font-bold uppercase tracking-[1em]">The Digital Philosophy</h3>
          <p className="text-3xl md:text-6xl font-light text-white italic leading-tight max-w-5xl mx-auto">
            "Agents are like developers with total world knowledge and <span className="text-accent font-bold">zero judgment.</span>"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-16 text-left max-w-6xl mx-auto px-12">
            <div className="space-y-4 border-l border-accent/30 pl-8">
              <div className="text-accent font-bold tracking-widest uppercase text-[10px]">The Struggle</div>
              <div className="text-white/80 text-xl font-light">Absolute correctness in legal and public facts.</div>
            </div>
            <div className="space-y-4 border-l border-white/10 pl-8">
              <div className="text-white font-bold tracking-widest uppercase text-[10px]">The Excellence</div>
              <div className="text-white/80 text-xl font-light">Discovering trends and exploring massive datasets.</div>
            </div>
            <div className="space-y-4 border-l border-white/10 pl-8">
              <div className="text-white font-bold tracking-widest uppercase text-[10px]">The Need</div>
              <div className="text-white/80 text-xl font-light">Orchestration, boundaries, and human judgment.</div>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Slide 8: Horizon */}
      <PresentationSection 
        videoUrl={videos[7]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
      >
        <Users className="h-16 w-16 text-accent mx-auto mb-10" />
        <p className="text-5xl md:text-7xl font-bold text-white tracking-tighter max-w-5xl leading-none">
          Teammates <br/>without <span className="text-accent italic">judgment.</span>
        </p>
        <div className="mt-24 space-y-6">
          <div className="w-16 h-px bg-white/30 mx-auto" />
          <p className="text-white/30 text-[10px] uppercase tracking-[0.8em] font-mono">Presentation Concluded • 2024 Innovation Hack</p>
        </div>
      </PresentationSection>
    </main>
  );
}
