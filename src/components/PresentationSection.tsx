
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

    // Ensure the video is properly muted and configured for autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Attempt to play the video when it comes into view
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Autoplay was prevented, or video failed to load:", error);
            });
          }
        } else {
          // Pause when not in view to save resources
          video.pause();
        }
      },
      {
        threshold: 0.1, // Trigger as soon as the section is 10% visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [videoUrl]);

  return (
    <section
      ref={sectionRef}
      className={cn("snap-section flex items-center justify-center relative overflow-hidden", className)}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        key={videoUrl}
        loop
        muted
        playsInline
        preload="auto"
        poster={fallbackImageUrl}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
