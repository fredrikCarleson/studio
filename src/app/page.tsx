
"use client";

import { useState, useEffect, useRef } from "react";
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSections = 5;

  const videos = [
    "https://joy1.videvo.net/videvo_files/video/free/video0467/large_watermarked/_import_615307779b5030.76863773_preview.mp4",
    "https://joy1.videvo.net/videvo_files/video/free/video0467/large_watermarked/_import_61530d1d60f4b3.56441467_preview.mp4",
    "https://joy1.videvo.net/videvo_files/video/free/2014-12/large_watermarked/Raindrops_And_Puddle_preview.mp4",
    "https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190828_27_Supernova_06_preview.mp4",
    "https://joy1.videvo.net/videvo_files/video/free/2014-12/large_watermarked/Network_preview.mp4",
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

  // Update index based on scroll position to keep UI buttons in sync with manual scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const height = window.innerHeight;
      const newIndex = Math.round(scrollY / height);
      if (newIndex !== currentIndex) {
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
          Hackathon. <span className="text-accent">Two days.</span> Three teams. Fifteen brains.
        </h1>
      </PresentationSection>

      {/* Section 2: The Challenge */}
      <PresentationSection 
        videoUrl={videos[1]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "team-bg")?.imageUrl || ""}
      >
        <p className="text-2xl md:text-4xl lg:text-5xl font-body font-light text-white max-w-5xl leading-relaxed">
          Could we, in just two days - without prior preparation - build solutions where <span className="text-accent font-semibold">multiple AI agents</span> collaborate to solve real problems at the Swedish Tax Agency?
        </p>
      </PresentationSection>

      {/* Section 3: Team Alpha */}
      <PresentationSection 
        videoUrl={videos[2]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "tax-agency-bg")?.imageUrl || ""}
      >
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-accent uppercase tracking-widest">
            Team Alpha: Influencer Risk
          </h2>
          <p className="text-xl md:text-3xl font-body text-white/90 max-w-3xl mx-auto leading-relaxed">
            One agent scrapes the web and collects social media data. <br className="hidden md:block" />
            A valuation agent estimates the value of products and gifts.
          </p>
        </div>
      </PresentationSection>

      {/* Section 4: Takeaways */}
      <PresentationSection 
        videoUrl={videos[3]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "agent-bg")?.imageUrl || ""}
      >
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-accent text-sm md:text-lg font-bold uppercase tracking-[0.3em]">Key Takeaways</h3>
            <p className="text-2xl md:text-4xl font-body text-white max-w-4xl italic">
              "More agents are more powerful - when agents are given roles, responsibilities, and peers, one plus one can become three."
            </p>
          </div>
          <div className="h-px w-24 bg-accent/30 mx-auto" />
          <p className="text-xl md:text-3xl font-body text-white/80 font-medium">
            Structure is more complex than technology.
          </p>
        </div>
      </PresentationSection>

      {/* Section 5: Conclusion */}
      <PresentationSection 
        videoUrl={videos[4]} 
        fallbackImageUrl={PlaceHolderImages.find(img => img.id === "takeaway-bg")?.imageUrl || ""}
      >
        <p className="text-xl md:text-3xl lg:text-4xl font-body font-light text-white max-w-4xl leading-relaxed">
          Because agents are not just technology. <br className="hidden md:block" />
          They're <span className="text-accent font-semibold underline underline-offset-8">teammates without judgment.</span> <br className="hidden md:block" />
          They need boundaries, orchestration, and patience.
        </p>
        <div className="mt-16 animate-bounce">
          <div className="text-accent/50 text-xs uppercase tracking-widest">NarrativeFlow Presentation</div>
        </div>
      </PresentationSection>
    </main>
  );
}
