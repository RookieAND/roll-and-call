"use client";

import { HStack, VStack, cn } from "@roll-and-call/ui";
import { useEffect, useRef, useState } from "react";

import { BadgeSlide } from "./badge-slide";
import { CarouselDot } from "./carousel-dot";
import { NoticeSlide } from "./notice-slide";
import { RecruitSlide } from "./recruit-slide";
import { ScheduleSlide } from "./schedule-slide";

const SLIDES = [
  { label: "구인", content: <RecruitSlide /> },
  { label: "일정 조율", content: <ScheduleSlide /> },
  { label: "알림", content: <NoticeSlide /> },
  { label: "업적", content: <BadgeSlide /> },
] as const;

const AUTOPLAY_MILLISECONDS = 4500;

export function FeatureCarousel() {
  const [current, setCurrent] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!paused.current) setCurrent((index) => (index + 1) % SLIDES.length);
    }, AUTOPLAY_MILLISECONDS);
    return () => clearInterval(timer);
  }, [restartKey]);

  const select = (index: number) => {
    setCurrent(index);
    setRestartKey((key) => key + 1);
  };

  return (
    <VStack
      role="region"
      aria-roledescription="carousel"
      aria-label="기능 미리보기"
      gap="175"
      className="min-w-0 flex-[1_1_440px]"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="grid">
        {SLIDES.map((slide, index) => {
          const active = index === current;
          return (
            <div
              key={slide.label}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${SLIDES.length} ${slide.label}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "grid grid-cols-2 content-start gap-150 transition-[opacity,transform,visibility] duration-[450ms] [grid-area:1/1]",
                active ? "visible opacity-100" : "invisible translate-y-2.5 opacity-0",
              )}
            >
              {slide.content}
            </div>
          );
        })}
      </div>
      <HStack justify="center">
        {SLIDES.map((slide, index) => (
          <CarouselDot
            key={slide.label}
            label={slide.label}
            active={index === current}
            onSelect={() => select(index)}
          />
        ))}
      </HStack>
    </VStack>
  );
}
