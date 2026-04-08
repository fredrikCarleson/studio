"use client";

import { useState, useEffect, useRef } from "react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, ArrowRight, Info, Zap, Shield, Users, Trophy, Clock, Cpu, MessageSquare, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

      {/* Stage Monitor UI */}
      <div className={cn(
        "fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start transition-opacity duration-1000",
        isUIHidden ? "opacity-0" : "opacity-100"
      )}>
        <div className="flex flex-col gap-1 w-64">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-accent/80 mb-1">
            <span>Chapter {currentIndex + 1}: {CHAPTERS[currentIndex]}</span>
            <span>{Math.round(((currentIndex + 1) / totalSections) * 100)}%</span>
          </div>
          <Progress value={((currentIndex + 1) / totalSections) * 100} className="h-[2px] bg-white/10" />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4 px-5 py-2 bg-black/40 backdrop-blur-xl rounded-sm border border-white/5">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">Remaining Time</span>
              <span className={cn("font-mono text-xl font-light", timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white")}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="h-8 w-8 rounded-full border border-white/10 p-0 text-white/40 hover:text-accent transition-colors"
            >
              {isTimerRunning ? "||" : "▶"}
            </Button>
          </div>
          <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-sm">
            <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">BETA 1.0</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className={cn(
        "fixed bottom-12 right-12 z-50 flex gap-6 items-center transition-all duration-1000",
        isUIHidden ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      )}>
        <button 
          onClick={() => scrollToSection(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="group flex flex-col items-center gap-2 disabled:opacity-0 transition-all"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
            <ArrowLeft className="h-5 w-5 text-white" />
          </div>
        </button>
        <button 
          onClick={() => scrollToSection(currentIndex + 1)}
          disabled={currentIndex === totalSections - 1}
          className="group flex flex-col items-center gap-2 disabled:opacity-0 transition-all"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
        </button>
      </div>

      {/* Pagination Indicator */}
      <div className={cn(
        "fixed left-12 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 transition-opacity duration-1000",
        isUIHidden ? "opacity-0" : "opacity-100"
      )}>
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className="group relative flex items-center"
          >
            <div className={cn(
              "w-1 transition-all duration-500",
              currentIndex === i ? "h-8 bg-accent" : "h-4 bg-white/20 group-hover:bg-white/40"
            )} />
            <span className={cn(
              "absolute left-4 text-[9px] uppercase tracking-[0.4em] transition-all duration-500 whitespace-nowrap",
              currentIndex === i ? "opacity-100 translate-x-0 text-accent" : "opacity-0 -translate-x-2 text-white/40"
            )}>
              {CHAPTERS[i]}
            </span>
          </button>
        ))}
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
          <Cpu className="h-16 w-16 text-accent mx-auto animate-pulse" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-12 px-6">
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-2xl text-left border-t-accent/50 border-t-2">
              <span className="text-accent text-3xl font-bold mb-4 block">01</span>
              <h4 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">The Scraper</h4>
              <p className="text-white/60 text-xs leading-relaxed">Scanning feeds multimodally to identify "undeclared" collaborations and gifts.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-2xl text-left">
              <span className="text-accent text-3xl font-bold mb-4 block">02</span>
              <h4 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">The Valuation</h4>
              <p className="text-white/60 text-xs leading-relaxed">Identifying luxury watches in YouTube videos and estimating market value instantly.</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-2xl text-left">
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
          
          <div className="relative py-8">
            <div className="absolute left-0 top-0 text-9xl text-accent/10 font-serif leading-none">"</div>
            <blockquote className="text-2xl md:text-5xl text-white font-light italic max-w-4xl mx-auto leading-tight px-12 relative z-10">
              Skatti… <br/>you're actually <span className="text-accent font-bold">making that up.</span>
            </blockquote>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-12 mt-12 text-left">
            <div className="border-l border-white/10 pl-6">
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-2">The "What"</p>
              <p className="text-white/60 text-sm">Official sites are perfect for regulations, but agents struggle with the rigid 'officialese'.</p>
            </div>
            <div className="border-l border-white/10 pl-6">
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-2">The "How"</p>
              <p className="text-white/60 text-sm">Unofficial sites explain logic better, but introduce hallucination risks. Verification is key.</p>
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
          
          {/* Agent Workflow Visual */}
          <div className="flex flex-col items-center gap-4 mt-8 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/40 uppercase tracking-widest rounded-sm">
                Annual Reports
              </div>
              <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/40 uppercase tracking-widest rounded-sm">
                SCB Statistics
              </div>
              <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/40 uppercase tracking-widest rounded-sm">
                Public Registry
              </div>
            </div>
            
            <div className="h-12 w-px bg-gradient-to-b from-white/20 to-accent" />
            
            <div className="flex gap-4 items-center">
              <div className="px-6 py-3 border border-accent bg-accent/10 rounded-sm text-accent font-bold text-sm tracking-[0.2em] animate-pulse">
                PARALLEL EXTRACTION
              </div>
              <div className="w-8 h-px bg-accent/40" />
              <div className="px-6 py-3 border border-accent bg-accent/10 rounded-sm text-accent font-bold text-sm tracking-[0.2em]">
                SERIAL REASONING
              </div>
            </div>
            
            <div className="h-12 w-px bg-gradient-to-b from-accent to-white/20" />
            
            <div className="p-8 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-lg w-full">
              <h4 className="text-white font-bold mb-2 tracking-widest uppercase text-xs">Outcome: Holistic Scrutiny</h4>
              <p className="text-white/60 text-sm italic">"What took hours to compile now takes minutes—with consistency humans can't match."</p>
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
          <div className="h-[1px] w-32 bg-accent mx-auto" />
          <p className="text-white/40 text-xs uppercase tracking-[0.5em]">The potential for crime prevention and stolen goods scanning.</p>
        </div>
      </PresentationSection>

      {/* Slide 7: Wisdom */}
      <PresentationSection 
        videoUrl={videos[6]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "takeaway-bg")?.imageUrl || ""}
      >
        <div className="space-y-16">
          <h3 className="text-accent text-sm font-bold uppercase tracking-[0.8em]">The Digital Philosophy</h3>
          <p className="text-3xl md:text-5xl font-light text-white italic leading-tight max-w-5xl mx-auto">
            "Agents are like developers with total world knowledge and <span className="text-accent font-bold">zero judgment.</span>"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left max-w-6xl mx-auto px-8">
            <div className="space-y-4">
              <div className="text-accent font-bold tracking-widest uppercase text-[10px]">Struggle</div>
              <div className="text-white/80 text-lg">Perfect correctness in legal facts.</div>
            </div>
            <div className="space-y-4">
              <div className="text-accent font-bold tracking-widest uppercase text-[10px]">Excel</div>
              <div className="text-white/80 text-lg">Discovering trends and exploring datasets.</div>
            </div>
            <div className="space-y-4">
              <div className="text-accent font-bold tracking-widest uppercase text-[10px]">Need</div>
              <div className="text-white/80 text-lg">Orchestration, boundaries, and humans.</div>
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
        <div className="mt-24 space-y-4">
          <div className="w-12 h-px bg-white/20 mx-auto" />
          <p className="text-white/20 text-[10px] uppercase tracking-[0.6em]">Presentation Concluded • 2024 Hackathon</p>
        </div>
      </PresentationSection>
    </main>
  );
}
