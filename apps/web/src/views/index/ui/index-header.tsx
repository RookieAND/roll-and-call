"use client";

import { cn, Container, HStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useEffect, useState } from "react";

import { BrandLogo, HelpButton, ThemeToggleButton, type MenuServer } from "@/shared/ui";

import { HERO_CTA_ID } from "../model/hero-cta-id";
import { IndexCta } from "./index-cta";

interface IndexHeaderProps {
  servers: MenuServer[] | null;
  joinable: MenuServer[];
}

const HEADER_HEIGHT = 64;

const SCROLL_THRESHOLD = 8;

// 히어로 위에 투명하게 겹쳐 있다가, 조금만 내려가도 불투명해지고 히어로의 주 버튼이 헤더 뒤로 넘어가면 같은 버튼을 작게 단다.
export function IndexHeader({ servers, joinable }: IndexHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [ctaHidden, setCtaHidden] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const target = document.getElementById(HERO_CTA_ID);
    if (isNull(target)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          setCtaHidden(!entry.isIntersecting && entry.boundingClientRect.top < HEADER_HEIGHT),
        ),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-(--rc-z-sticky) -mb-800 border-b border-transparent transition-colors",
        scrolled && "border-gray-200 bg-surface/90 backdrop-blur",
      )}
    >
      <Container render={<header />}>
        <HStack align="center" gap="050" className="h-16">
          <div className="flex min-w-0 flex-1">
            <BrandLogo label="Roll & Call" />
          </div>
          <HelpButton />
          <ThemeToggleButton />
          {ctaHidden && (
            <div className="ml-075 flex min-w-0">
              <IndexCta servers={servers} joinable={joinable} compact />
            </div>
          )}
        </HStack>
      </Container>
    </div>
  );
}
