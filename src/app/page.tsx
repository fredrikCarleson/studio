
"use client";

import { useState, useEffect, useRef } from "react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, ArrowRight, Info, Zap, Shield, Users, Trophy, Timer, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSections = 8;

  const videos = [
    "/videos/video_intro.mp4",    // 0: Intro
    "/videos/video_mission.mp4",  // 1: The Quest
    "/videos/video_alpha.mp4",    // 2: Team Alpha
    "/videos/video_bravo.mp4",    // 3: Team Bravo
    "/videos/video_delta.mp4",    // 4: Team Delta
    "/videos/video_winner.mp4",   // 5: The Winner
    "/videos/video_lesson.mp4",   // 6: The Philosophy
    "/videos/video_future.mp4",   // 7: The Future
  ];

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= totalSections) return;
    const sections = containerRef.current?.querySelectorAll('section');
    if (sections && sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(index);
      if (index === 1 && !isTimerRunning) setIsTimerRunning(true);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const height = window.innerHeight;
      const newIndex = Math.round(scrollY / height);
      if (newIndex !== currentIndex && newIndex < totalSections) {
        setCurrentIndex(newIndex);
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  return (
    <main ref={containerRef} className="snap-container relative bg-black">
      {/* Top Header: Progress & Timer */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex flex-col gap-2 w-48 pointer-events-auto">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / totalSections) * 100)}%</span>
          </div>
          <Progress value={((currentIndex + 1) / totalSections) * 100} className="h-1 bg-white/10" />
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
          <Clock className={cn("h-4 w-4", timeLeft < 300 ? "text-red-500 animate-pulse" : "text-accent")} />
          <span className="font-mono text-sm text-white font-medium">{formatTime(timeLeft)}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="h-6 w-6 p-0 text-white/40 hover:text-white"
          >
            {isTimerRunning ? "||" : "▶"}
          </Button>
        </div>
      </div>

      {/* Navigation Controls Overlay */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToSection(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="rounded-full bg-black/20 border-accent/30 text-white hover:bg-accent hover:text-white transition-all backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToSection(currentIndex + 1)}
          disabled={currentIndex === totalSections - 1}
          className="rounded-full bg-black/20 border-accent/30 text-white hover:bg-accent hover:text-white transition-all backdrop-blur-sm"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Pagination Dots */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {Array.from({ length: totalSections }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === i ? "bg-accent w-6" : "bg-white/30 hover:bg-white/60"
            )}
            aria-label={`Go to section ${i + 1}`}
          />
        ))}
      </div>

      {/* Section 1: Intro */}
      <PresentationSection 
        videoUrl={videos[0]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-white max-w-4xl leading-tight">
          Hackathon. <span className="text-accent">Two days.</span> <br/> Three teams. Fifteen brains.
        </h1>
        <p className="text-white/60 text-lg md:text-xl font-light tracking-widest uppercase mt-4">
          A Journey into Agentic AI at the Swedish Tax Agency
        </p>
      </PresentationSection>

      {/* Section 2: The Quest */}
      <PresentationSection 
        videoUrl={videos[1]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "tax-agency-bg")?.imageUrl || ""}
      >
        <div className="space-y-6 max-w-5xl">
          <Info className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white uppercase tracking-tighter">The Bold Mission</h2>
          <p className="text-xl md:text-3xl font-body font-light text-white/90 leading-relaxed">
            Could we build solutions where <span className="text-accent font-semibold">multiple AI agents</span> collaborate to solve real problems without prior preparation?
          </p>
          <div className="flex justify-center gap-12 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">0</div>
              <div className="text-xs text-white/40 uppercase">Preparation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">3</div>
              <div className="text-xs text-white/40 uppercase">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">48h</div>
              <div className="text-xs text-white/40 uppercase">Deadline</div>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Section 3: Team Alpha (Influencer Risk) */}
      <PresentationSection 
        videoUrl={videos[2]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "agent-bg")?.imageUrl || ""}
      >
        <div className="space-y-8">
          <div className="inline-block px-4 py-1 bg-accent/20 border border-accent/30 rounded-full text-accent text-sm font-bold uppercase tracking-widest">
            Agent Swarm Strategy
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">Team Alpha: Influencer Risk</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto italic">
            Identifying luxury watches in YouTube videos and comparing with declared income.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mt-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <h4 className="text-accent font-bold mb-2">Scraper Agent</h4>
              <p className="text-white/80 text-sm">Automated feed analysis across multiple social platforms at speed.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <h4 className="text-accent font-bold mb-2">Valuation Agent</h4>
              <p className="text-white/80 text-sm">Estimated high-value product gifts using real-time market data.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <h4 className="text-accent font-bold mb-2">Risk Agent</h4>
              <p className="text-white/80 text-sm">Consolidated everything into a single profile with next-step logic.</p>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Section 4: Team Bravo (Skatti 2.0) */}
      <PresentationSection 
        videoUrl={videos[3]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "bravo-bg")?.imageUrl || ""}
      >
        <div className="space-y-8 max-w-4xl">
          <Zap className="h-12 w-12 text-accent mx-auto" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">Team Bravo: Skatti 2.0</h2>
          <p className="text-xl md:text-2xl text-white/90 italic">
            "The official sites explain what to do, not how."
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="text-left space-y-4">
              <h4 className="text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" /> The Trap
              </h4>
              <p className="text-white/60 text-sm">The "trained" agent performed worse because official data lacked pedagogy.</p>
            </div>
            <div className="text-left space-y-4">
              <h4 className="text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> The Solution
              </h4>
              <p className="text-white/60 text-sm">Brilliant for reasoning and hypothesis testing, not just fact retrieval.</p>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Section 5: Team Delta (Holistic Risk) */}
      <PresentationSection 
        videoUrl={videos[4]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "delta-bg")?.imageUrl || ""}
      >
        <div className="space-y-8 max-w-5xl">
          <Shield className="h-12 w-12 text-accent mx-auto" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">Team Delta: Holistic View</h2>
          <p className="text-xl md:text-2xl text-white/90">
            Drowning in data? <span className="text-accent">Automating the first risk assessment.</span>
          </p>
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex gap-4">
              <div className="p-4 bg-white/10 rounded border border-white/20">Annual Reports</div>
              <div className="p-4 bg-white/10 rounded border border-white/20">Statistics Sweden</div>
              <div className="p-4 bg-white/10 rounded border border-white/20">Public Registries</div>
            </div>
            <ArrowRight className="rotate-90 text-accent h-8 w-8" />
            <div className="p-6 bg-accent/20 rounded-full border border-accent text-accent font-bold">
              Parallel Orchestration & Callbacks
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Section 6: The Verdict */}
      <PresentationSection 
        videoUrl={videos[5]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "winner-bg")?.imageUrl || ""}
      >
        <Trophy className="h-16 w-16 text-accent mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-headline font-bold text-white mb-4">The Winner: Team Alpha</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-xl md:text-3xl font-body text-white/80 leading-relaxed">
            Multi-agent systems show their power when they are given <span className="text-accent font-bold italic">roles, responsibilities, and peers.</span>
          </p>
          <div className="h-px w-full bg-white/10" />
          <p className="text-white/50 text-sm uppercase tracking-[0.3em]">One plus one became three.</p>
        </div>
      </PresentationSection>

      {/* Section 7: The Core Lesson */}
      <PresentationSection 
        videoUrl={videos[6]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "takeaway-bg")?.imageUrl || ""}
      >
        <div className="space-y-12 max-w-5xl">
          <h3 className="text-accent text-sm md:text-lg font-bold uppercase tracking-[0.4em]">The Digital Team Philosophy</h3>
          <p className="text-2xl md:text-4xl font-body text-white italic leading-snug">
            "Agents are like developers with total world knowledge and <span className="text-accent">zero judgment.</span> They need boundaries, structure, and peers."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-2">
              <div className="text-accent font-bold">Agents struggle with</div>
              <div className="text-white/60">Perfect correctness</div>
            </div>
            <div className="space-y-2">
              <div className="text-accent font-bold">Agents excel at</div>
              <div className="text-white/60">Discovering trends</div>
            </div>
            <div className="space-y-2">
              <div className="text-accent font-bold">Agents need</div>
              <div className="text-white/60">Orchestration</div>
            </div>
          </div>
        </div>
      </PresentationSection>

      {/* Section 8: The Future */}
      <PresentationSection 
        videoUrl={videos[7]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
      >
        <Users className="h-12 w-12 text-accent mx-auto mb-6" />
        <h2 className="text-white/40 text-sm uppercase tracking-widest mb-4">Final Thought</h2>
        <p className="text-xl md:text-3xl lg:text-4xl font-body font-light text-white max-w-4xl leading-relaxed mb-12">
          The future isn't science fiction. It's built with <span className="text-accent font-semibold underline underline-offset-8 italic">teammates without judgment.</span>
        </p>
        <div className="mt-20 text-white/20 text-xs">
          Presentation Finished • Thank You
        </div>
      </PresentationSection>
    </main>
  );
}
