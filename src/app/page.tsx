
import { PresentationSection } from "@/components/PresentationSection";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  // Using high quality public sample videos for the demonstration
  const videos = [
    "https://joy1.videvo.net/videvo_files/video/free/video0467/large_watermarked/_import_615307779b5030.76863773_preview.mp4", // Abstract Tech
    "https://joy1.videvo.net/videvo_files/video/free/video0467/large_watermarked/_import_61530d1d60f4b3.56441467_preview.mp4", // Digital Flow
    "https://joy1.videvo.net/videvo_files/video/free/2014-12/large_watermarked/Raindrops_And_Puddle_preview.mp4", // Reflection/Tax Agency mood
    "https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190828_27_Supernova_06_preview.mp4", // Cosmic/Complex
    "https://joy1.videvo.net/videvo_files/video/free/2014-12/large_watermarked/Network_preview.mp4", // Network/Takeaways
  ];

  return (
    <main className="snap-container">
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
