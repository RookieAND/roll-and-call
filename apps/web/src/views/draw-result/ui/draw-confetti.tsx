"use client";

import { useEffect, useState } from "react";

const PIECE_COUNT = 16;
const COLORS = ["#4f46e5", "#a5b4fc", "#6ee7b7", "#0b9c6c", "#f0c860", "#c7d2fe"] as const;
const SHOW_MS = 2400;

// 접속하자마자 한 번 쏟아진다. 부모가 relative여야 그 칸 안에서만 떨어진다.
export function DrawConfetti() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: PIECE_COUNT }, (_, index) => (
        <span
          key={index}
          className="absolute -top-3.5 animate-confetti-fall rounded-[2px]"
          style={{
            left: `${4 + index * 6.1}%`,
            width: index % 3 === 0 ? 6 : 7,
            height: index % 4 === 0 ? 7 : 11,
            background: COLORS[index % COLORS.length],
            animationDuration: `${1.3 + (index % 5) * 0.12}s`,
            animationDelay: `${(index % 8) * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}
