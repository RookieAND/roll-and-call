"use client";

import { useEffect, useState } from "react";

const PIECE_COUNT = 48;
const COLOR_COUNT = 6;
const SHOW_MS = 4000;

// 접속하자마자 화면 전체에 한 번 쏟아진다.
// 자리·크기·박자는 인덱스에서 결정적으로 만든다. 서버와 클라이언트가 같은 HTML을 그려야 해서 Math.random을 쓰지 않는다.
export function DrawConfetti() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: PIECE_COUNT }, (_, index) => (
        <span
          key={index}
          className="absolute -top-4 animate-confetti-fall rounded-[2px]"
          style={{
            left: `${(index * 37 + 3) % 100}%`,
            width: 7 + (index % 3) * 2,
            height: index % 4 === 0 ? 8 : 13,
            background: `var(--color-confetti-${(index % COLOR_COUNT) + 1})`,
            animationDuration: `${2.2 + (index % 7) * 0.16}s`,
            animationDelay: `${(index % 9) * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
