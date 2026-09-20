"use client";

import { Button, cn, Container, HStack, Text, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { type PointerEvent, useEffect, useRef, useState } from "react";

import { markOnboardingSeen } from "../model/onboarding-seen";
import { ONBOARDING_SLIDES } from "../model/onboarding-slides";
import { swipeDirection } from "../model/swipe-direction";
import { ActiveSlideDot } from "./active-slide-dot";
import { SlideDot } from "./slide-dot";
import { SlideVisual } from "./slide-visual";
import { WelcomeVisual } from "./welcome-visual";

const DONE_HREF = "/games";

export function OnboardingView() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  // 건너뛰기든 끝까지 보든 두 번 뜨지 않게, 들어온 순간 본 것으로 친다.
  useEffect(markOnboardingSeen, []);

  const slide = ONBOARDING_SLIDES[index]!;
  const welcome = slide.eyebrow === null;
  const last = index === ONBOARDING_SLIDES.length - 1;
  const nextLabel = welcome ? "둘러보기" : last ? "구인 목록 보러 가기" : "다음";
  // 남는 높이를 위아래로 나눠 갖는다. 내용이 더 길면 flex-1이 늘어나므로 위가 잘리지 않는다.
  const slideClass = cn(
    "flex flex-1 flex-col justify-center touch-pan-y",
    back ? "animate-slide-in-back" : "animate-slide-in",
    welcome && "items-center text-center",
  );

  const skip = () => router.replace(DONE_HREF);

  const goNext = () => {
    if (last) {
      router.replace(DONE_HREF);
      return;
    }
    setBack(false);
    setIndex(index + 1);
  };

  const goPrevious = () => {
    if (index === 0) return;
    setBack(true);
    setIndex(index - 1);
  };

  const onPointerEnd = (event: PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const direction = swipeDirection(event.clientX - start.x, event.clientY - start.y);
    // 마지막 장에서 더 밀어도 화면을 떠나지 않는다. 떠나는 것은 버튼으로만.
    if (direction === "next" && !last) goNext();
    if (direction === "previous") goPrevious();
  };

  return (
    <VStack className="min-h-dvh" style={{ backgroundImage: "var(--gradient-onboarding)" }}>
      <span className="h-[52px] flex-none" />
      <Container size="sm" className="flex flex-1 flex-col">
        <div
          key={slide.key}
          className={slideClass}
          onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={onPointerEnd}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          {slide.eyebrow === null ? <WelcomeVisual /> : <SlideVisual slideKey={slide.key} />}
          <VStack gap="150" className={welcome ? "mt-400" : "mt-300"}>
            {slide.eyebrow && (
              <Text
                typography="code2"
                foreground="primary"
                render={<p />}
                className="tracking-widest"
              >
                {slide.eyebrow}
              </Text>
            )}
            <Text typography="heading1" render={<h1 />} className="leading-[1.32]">
              {slide.title}
            </Text>
            <Text typography="body2" foreground="muted" render={<p />} className="leading-[1.8]">
              {slide.body}
            </Text>
          </VStack>
        </div>
        <HStack justify="center" gap="075" className="py-200">
          {ONBOARDING_SLIDES.map((item, itemIndex) =>
            itemIndex === index ? <ActiveSlideDot key={item.key} /> : <SlideDot key={item.key} />,
          )}
        </HStack>
        <VStack gap="050" className="mb-300">
          <Button size="lg" className="w-full" onClick={goNext}>
            {nextLabel}
          </Button>
          {!last && (
            <Button variant="ghost" className="h-11 w-full text-gray-600" onClick={skip}>
              건너뛰기
            </Button>
          )}
        </VStack>
      </Container>
    </VStack>
  );
}
