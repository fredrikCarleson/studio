"use client";

import { useEffect, useRef, useState, memo, type FC, type RefObject, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Intersection ratio at or above this counts as "active" — one full slide
 * dominates the viewport with snap scrolling, so 0.6 is decisive without
 * triggering too early during the snap animation.
 */
const ACTIVE_THRESHOLD = 0.6;

interface PresentationSectionProps {
  videoUrl: string;
  fallbackImageUrl: string;
  children: ReactNode;
  className?: string;
  /** Applied to the fade-in-stagger wrapper. Use for per-slide spacing/layout. */
  contentClassName?: string;
  priority?: boolean;
  sectionIndex: number;
  chapterName?: string;
  scrollRootRef: RefObject<HTMLElement | null>;
  onSectionActiveChange?: (index: number, active: boolean) => void;
}

const PresentationSectionBase: FC<PresentationSectionProps> = ({
  videoUrl,
  fallbackImageUrl,
  children,
  className,
  contentClassName,
  priority = false,
  sectionIndex,
  chapterName,
  scrollRootRef,
  onSectionActiveChange,
}) => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevActiveRef = useRef<boolean | null>(null);
  const loadRequestedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = scrollRootRef.current ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const ratio = entry.intersectionRatio;
        const nowActive = ratio >= ACTIVE_THRESHOLD;

        // Lazy-load video when it first enters the viewport at all
        if (entry.isIntersecting && ratio > 0 && !loadRequestedRef.current) {
          loadRequestedRef.current = true;
          setShouldLoadVideo(true);
        }

        // Only fire the parent callback & visible state when active status changes
        if (prevActiveRef.current !== nowActive) {
          prevActiveRef.current = nowActive;
          setIsSectionVisible(nowActive);
          onSectionActiveChange?.(sectionIndex, nowActive);
        }

        // Play/pause based on visibility — uses hardware decoder directly
        const video = videoRef.current;
        if (video) {
          if (nowActive) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      {
        root,
        rootMargin: "0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      prevActiveRef.current = null;
    };
  }, [sectionIndex, scrollRootRef, onSectionActiveChange]);

  // Resume playback when video element is first populated
  useEffect(() => {
    if (!shouldLoadVideo || !isSectionVisible) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [shouldLoadVideo, isSectionVisible, isVideoLoaded]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "snap-section flex items-center justify-center relative overflow-hidden bg-black",
        isSectionVisible && "section-visible",
        className
      )}
      aria-label={chapterName ? `Slide: ${chapterName}` : "Presentation Slide"}
    >
      {/* Video Background */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-1000",
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
            className="video-bg absolute inset-0 h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Placeholder image shown until video is ready */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-0">
          <Image
            src={fallbackImageUrl}
            alt=""
            fill
            priority={priority}
            className="object-cover opacity-40 grayscale"
            sizes="100vw"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      )}

      {/* Cinematic gradient — heavier at top and bottom for text legibility */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/75 via-black/20 to-black/85" />

      {/* Slide Content */}
      <div className="relative z-20 container mx-auto px-6">
        <div className={cn("fade-in-stagger flex flex-col items-center justify-center text-center", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
};

export const PresentationSection = memo(PresentationSectionBase);
