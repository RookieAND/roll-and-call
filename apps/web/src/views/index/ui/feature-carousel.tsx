"use client";

import { HStack, IconButton, VStack, cn } from "@roll-and-call/ui";
import { Pause, Play } from "lucide-react";
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
  const [playing, setPlaying] = useState(true);
  const hovered = useRef(false);

  // 움직임 줄이기 설정이면 멈춘 채로 시작한다. 그래도 재생을 누르면 넘긴다.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (!hovered.current) setCurrent((index) => (index + 1) % SLIDES.length);
    }, AUTOPLAY_MILLISECONDS);
    return () => clearInterval(timer);
  }, [playing]);

  const select = (index: number) => {
    setCurrent(index);
    setPlaying(false);
  };
  const toggleLabel = playing ? "일시 정지" : "재생";
  const ToggleIcon = playing ? Pause : Play;

  return (
    <VStack
      role="region"
      aria-roledescription="carousel"
      aria-label="기능 미리보기"
      gap="175"
      className="min-w-0 flex-[1_1_440px]"
      onMouseEnter={() => {
        hovered.current = true;
      }}
      onMouseLeave={() => {
        hovered.current = false;
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
                "grid grid-cols-2 content-start gap-150 transition-[opacity,transform,visibility] duration-450 [grid-area:1/1]",
                active ? "visible opacity-100" : "invisible translate-y-2.5 opacity-0",
              )}
            >
              {slide.content}
            </div>
          );
        })}
      </div>
      <HStack justify="center" align="center">
        {SLIDES.map((slide, index) => (
          <CarouselDot
            key={slide.label}
            label={slide.label}
            active={index === current}
            onSelect={() => select(index)}
          />
        ))}
        <IconButton
          variant="ghost"
          aria-label={toggleLabel}
          onClick={() => setPlaying((value) => !value)}
          className="ml-100 size-11 rounded-full"
        >
          <ToggleIcon size={16} fill="currentColor" aria-hidden />
        </IconButton>
      </HStack>
    </VStack>
  );
}
