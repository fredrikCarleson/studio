
"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PresentationSectionProps {
  videoUrl: string;
  fallbackImageUrl: string;
  children: React.ReactNode;
  className?: string;
}

export const PresentationSection: React.FC<PresentationSectionProps> = ({
  videoUrl,
  fallbackImageUrl,
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setShouldLoadVideo(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          setIsVisible(false);
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("snap-section flex items-center justify-center relative overflow-hidden bg-black", className)}
      aria-label="Presentation Slide"
    >
      {/* Background Layer */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 z-0",
          isVideoLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setIsVideoLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-[5000ms] ease-out",
              isVisible ? "scale-110" : "scale-100"
            )}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Fallback Image Layer (visible until video loads) */}
      {!isVideoLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40 grayscale"
          style={{ backgroundImage: `url(${fallbackImageUrl})` }}
          role="img"
          aria-label="Slide background placeholder"
        />
      )}

      {/* Global Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10" />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6">
        <div className={cn(
          "fade-in-stagger flex flex-col items-center justify-center text-center transition-all duration-1000", 
          isVisible ? "visible opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}>
          {children}
        </div>
      </div>
    </section>
  );
};
