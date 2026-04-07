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
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          video.play().catch(() => {});
        } else {
          setIsVisible(false);
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("snap-section flex items-center justify-center relative overflow-hidden", className)}
    >
      <video
        ref={videoRef}
        key={videoUrl}
        loop
        muted
        playsInline
        preload="auto"
        poster={fallbackImageUrl}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ease-out z-0",
          isVisible ? "scale-105" : "scale-100"
        )}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-10" />

      <div className="relative z-20 container mx-auto px-6">
        <div className={cn("fade-in-stagger flex flex-col items-center justify-center text-center", isVisible && "visible")}>
          {children}
        </div>
      </div>
    </section>
  );
};