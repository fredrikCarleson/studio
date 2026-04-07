
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Force play on visibility to handle mobile/browser power saving
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Handle potential silent play blocking
            });
          }
        }
      },
      {
        threshold: 0.2, // Lower threshold for more reliable trigger
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("snap-section flex items-center justify-center relative overflow-hidden", className)}
    >
      {/* Background Video - Using key to force refresh on source change */}
      <video
        ref={videoRef}
        key={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={fallbackImageUrl}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <div
          className={cn(
            "fade-in-up flex flex-col items-center justify-center space-y-6",
            isVisible && "visible"
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
};
