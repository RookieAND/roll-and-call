"use client";

import { Chip } from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

const MAX_ROWS = 3;
// 「+N」 칩이 마지막 줄 끝에 들어갈 자리. 세 글자짜리 칩 폭에 여유를 둔 값이다.
const BADGE_WIDTH = 56;

interface GrantSelectedChipsProps {
  // 묶음 이름과 단위. 「고른 룰북 5권」, 「고른 유저 3명」처럼 쓴다.
  noun: string;
  unit: string;
  items: { id: string; label: string }[];
  disabled: boolean;
  onRemove: (id: string) => void;
}

// 숨겨 둔 복제 목록을 재서 3줄 안에 들어가는 칩 수를 구한다. 마지막 줄에는 「+N」 칩 자리를 비워 둔다.
function countFitting(ghost: HTMLUListElement) {
  const items = Array.from(ghost.children) as HTMLElement[];
  const tops = [...new Set(items.map((item) => item.offsetTop))].toSorted((a, b) => a - b);
  if (tops.length <= MAX_ROWS) return items.length;
  const lastRowTop = tops[MAX_ROWS - 1] ?? 0;
  const gap = Number.parseFloat(getComputedStyle(ghost).columnGap) || 0;
  let count = items.findIndex((item) => item.offsetTop > lastRowTop);
  while (count > 0) {
    const last = items[count - 1];
    const crowded =
      last?.offsetTop === lastRowTop &&
      last.offsetLeft + last.offsetWidth + gap + BADGE_WIDTH > ghost.clientWidth;
    if (!crowded) break;
    count -= 1;
  }
  return count;
}

// 고른 룰북·유저를 모아 보이는 묶음. 칩이 3줄을 넘으면 접고 끝에 「+N」 칩을 두며, 누르면 모두 펼치고 「접기」로 되돌린다.
export function GrantSelectedChips({
  noun,
  unit,
  items,
  disabled,
  onRemove,
}: GrantSelectedChipsProps) {
  const [expanded, setExpanded] = useState(false);
  const [fitting, setFitting] = useState(items.length);
  const ghostRef = useRef<HTMLUListElement>(null);
  const signature = items.map((item) => item.id).join(",");

  useLayoutEffect(() => {
    const ghost = ghostRef.current;
    if (!ghost) return;
    const measure = () => setFitting(countFitting(ghost));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ghost);
    return () => observer.disconnect();
  }, [signature]);

  const hiddenCount = items.length - fitting;
  const overflow = hiddenCount > 0;
  const shown = expanded || !overflow ? items : items.slice(0, fitting);

  return (
    <div className="relative">
      <ul
        ref={ghostRef}
        aria-hidden
        inert
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-075"
      >
        {items.map((item) => (
          <li key={item.id}>
            <Chip selected tabIndex={-1}>
              {item.label}
              <X size={12} aria-hidden />
            </Chip>
          </li>
        ))}
      </ul>
      <ul aria-label={`고른 ${noun}`} className="flex flex-wrap gap-075">
        {shown.map((item) => (
          <li key={item.id}>
            <Chip
              selected
              disabled={disabled}
              aria-label={`${item.label} 선택 해제`}
              onClick={() => onRemove(item.id)}
            >
              {item.label}
              <X size={12} aria-hidden />
            </Chip>
          </li>
        ))}
        {overflow ? (
          <li>
            <Chip
              tone="outline"
              aria-expanded={expanded}
              aria-label={
                expanded ? `고른 ${noun} 접기` : `고른 ${noun} ${items.length}${unit} 모두 보기`
              }
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "접기" : `+${hiddenCount}`}
            </Chip>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
