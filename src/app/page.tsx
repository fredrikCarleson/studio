
"use client";

import { useState, useEffect, useRef } from "react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, ArrowRight, Info, Zap, Shield, Users, Trophy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        scrollToSection(currentIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
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
    <main ref={containerRef} className="snap-container relative">
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
          A Journey into Agentic AI
        </p>
      </PresentationSection>

      {/* Section 2: The Quest */}
      <PresentationSection 
        videoUrl={videos[1]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "tax-agency-bg")?.imageUrl || ""}
      >
        <div className="space-y-6 max-w-5xl">
          <Info className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">The Bold Mission</h2>
          <p className="text-xl md:text-3xl font-body font-light text-white/90 leading-relaxed">
            Could we build solutions where <span className="text-accent font-semibold">multiple AI agents</span> collaborate to solve real problems at the Swedish Tax Agency?
          </p>
        </div>
      </PresentationSection>

      {/* Section 3: Team Alpha (Influencer Risk) */}
      <PresentationSection 
        videoUrl={videos[2]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "agent-bg")?.imageUrl || ""}
      >
        <div className="space-y-8">
          <div className="inline-block px-4 py-1 bg-accent/20 border border-accent/30 rounded-full text-accent text-sm font-bold uppercase tracking-widest">
            The Swarm Approach
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">Team Alpha: Influencer Risk</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <h4 className="text-accent font-bold mb-2">Scraping Agent</h4>
              <p className="text-white/80 text-sm">Collects social media data and brand deals at scale.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <h4 className="text-accent font-bold mb-2">Valuation Agent</h4>
              <p className="text-white/80 text-sm">Estimates gift values and compares with declared income.</p>
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
            "Answering 'how' is very different from 'what'."
          </p>
          <p className="text-lg text-white/70">
            A lesson in precision: For legal answers, LLMs aren't enough. <br className="hidden md:block" /> 
            For <span className="text-white font-semibold">reasoning and pedagogy</span>, they are brilliant colleagues.
          </p>
        </div>
      </PresentationSection>

      {/* Section 5: Team Delta (Holistic Risk) */}
      <PresentationSection 
        videoUrl={videos[4]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "delta-bg")?.imageUrl || ""}
      >
        <div className="space-y-8 max-w-4xl">
          <Shield className="h-12 w-12 text-accent mx-auto" />
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">Team Delta: Holistic View</h2>
          <p className="text-xl md:text-2xl text-white/90">
            Drowning in data? <span className="text-accent">Delta automated the compile.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-3 py-1 bg-white/10 rounded border border-white/20 text-xs">Annual Reports</span>
            <span className="px-3 py-1 bg-white/10 rounded border border-white/20 text-xs">Registry Data</span>
            <span className="px-3 py-1 bg-white/10 rounded border border-white/20 text-xs">Statistics Sweden</span>
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
        <p className="text-xl md:text-3xl font-body text-white/80 max-w-4xl mx-auto leading-relaxed">
          Dynamic orchestration. Real agents, not just API calls. <br className="hidden md:block" />
          They showed how <span className="text-accent font-bold">1 + 1 can become 3</span> when agents are given roles and peers.
        </p>
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
          <div className="h-px w-32 bg-accent/30 mx-auto" />
          <p className="text-xl md:text-2xl font-body text-white/70">
            Structure is more complex than technology.
          </p>
        </div>
      </PresentationSection>

      {/* Section 8: The Future */}
      <PresentationSection 
        videoUrl={videos[7]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "hero-bg")?.imageUrl || ""}
      >
        <Users className="h-12 w-12 text-accent mx-auto mb-6" />
        <p className="text-xl md:text-3xl lg:text-4xl font-body font-light text-white max-w-4xl leading-relaxed mb-12">
          The future is here. Agents are no longer science fiction. <br className="hidden md:block" />
          They're <span className="text-accent font-semibold underline underline-offset-8 italic">teammates without judgment.</span>
        </p>
        <div className="space-y-4">
          <div className="text-accent/50 text-xs uppercase tracking-widest">NarrativeFlow: The Journey Continues</div>
          <p className="text-white/40 text-sm">Thank You for Watching</p>
        </div>
      </PresentationSection>
    </main>
  );
}
