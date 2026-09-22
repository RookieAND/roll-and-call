"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

const COLOR_COUNT = 6;

// 접속하자마자 화면 양옆에서 한 번씩, 가운데 위에서 한 번 크게 터진다.
export function DrawConfetti() {
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const colors = Array.from({ length: COLOR_COUNT }, (_, index) =>
      style.getPropertyValue(`--color-confetti-${index + 1}`).trim(),
    );
    const shared = { colors, disableForReducedMotion: true, zIndex: 50 };

    confetti({ ...shared, particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...shared, particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    const timer = setTimeout(
      () =>
        confetti({
          ...shared,
          particleCount: 120,
          spread: 110,
          startVelocity: 45,
          origin: { x: 0.5, y: 0.3 },
        }),
      250,
    );
    return () => {
      clearTimeout(timer);
      confetti.reset();
    };
  }, []);

  return null;
}
