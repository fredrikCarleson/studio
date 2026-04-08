
"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PresentationSectionProps {
  videoUrl: string;
  fallbackImageUrl: string;
  children: React.ReactNode;
  className?: string;
  priority?: boolean;
}

const PresentationSectionBase: React.FC<PresentationSectionProps> = ({
  videoUrl,
  fallbackImageUrl,
  children,
  className,
  priority = false,
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
      { threshold: 0.15, rootMargin: "50px" }
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
            preload="none"
            onLoadedData={() => setIsVideoLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-[8000ms] ease-out will-change-transform",
              isVisible ? "scale-110" : "scale-100"
            )}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Optimized Fallback Image */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-0">
          <Image
            src={fallbackImageUrl}
            alt=""
            fill
            priority={priority}
            className="object-cover opacity-40 grayscale"
            sizes="100vw"
          />
        </div>
      )}

      {/* Optimized Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-10 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6">
        <div className={cn(
          "fade-in-stagger flex flex-col items-center justify-center text-center transition-all duration-1000", 
          isVisible ? "visible opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {children}
        </div>
      </div>
    </section>
  );
};

export const PresentationSection = memo(PresentationSectionBase);
