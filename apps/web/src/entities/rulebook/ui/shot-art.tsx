import type { CertShot } from "../model/cert-shot";

// 역할 토큰으로만 칠한 선 그림이라 테마를 따라 바뀐다. 앞면의 노란 쪽지가 디스코드 닉네임 쪽지다.
const COLOR = {
  cover: "var(--rc-color-bg-primary-weak)",
  edge: "var(--rc-color-border-primary)",
  ink: "var(--rc-color-fg-primary)",
  paper: "var(--rc-color-bg-notice-weak)",
  paperEdge: "var(--rc-color-border-notice)",
  pen: "var(--rc-color-fg-notice)",
  floor: "var(--rc-color-border-strong)",
  bar: "var(--rc-color-fg-muted)",
  base: "var(--rc-color-bg-canvas-base)",
} as const;

const BACK_LINES = [22, 29, 36, 43] as const;
const BARCODE = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

interface ShotArtProps {
  shot: CertShot;
}

export function ShotArt({ shot }: ShotArtProps) {
  return (
    <svg viewBox="0 0 90 120" width="100%" height="100%" aria-hidden className="block">
      {shot === "front" && (
        <>
          <rect
            x={18}
            y={12}
            width={54}
            height={78}
            rx={3}
            fill={COLOR.cover}
            stroke={COLOR.edge}
            strokeWidth={1.5}
          />
          <rect x={18} y={12} width={6} height={78} fill={COLOR.edge} opacity={0.5} />
          <rect x={31} y={24} width={32} height={5} rx={2} fill={COLOR.ink} />
          <rect x={31} y={33} width={22} height={4} rx={2} fill={COLOR.ink} opacity={0.55} />
          <rect x={31} y={42} width={11} height={6} rx={2} fill={COLOR.ink} opacity={0.8} />
          <circle
            cx={47}
            cy={64}
            r={9}
            fill="none"
            stroke={COLOR.ink}
            strokeWidth={1.5}
            opacity={0.7}
          />
          <g transform="rotate(-7 62 96)">
            <rect
              x={43}
              y={84}
              width={38}
              height={22}
              rx={2}
              fill={COLOR.paper}
              stroke={COLOR.paperEdge}
              strokeWidth={1.2}
            />
            <path
              d="M48 96q2.5-4 5 0t5 0t5 0t5 0t5 0"
              fill="none"
              stroke={COLOR.pen}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </g>
        </>
      )}
      {shot === "back" && (
        <>
          <rect
            x={18}
            y={12}
            width={54}
            height={78}
            rx={3}
            fill={COLOR.cover}
            stroke={COLOR.edge}
            strokeWidth={1.5}
          />
          <rect x={66} y={12} width={6} height={78} fill={COLOR.edge} opacity={0.5} />
          {BACK_LINES.map((y, index) => (
            <rect
              key={y}
              x={27}
              y={y}
              width={index === 3 ? 22 : 34}
              height={3}
              rx={1.5}
              fill={COLOR.ink}
              opacity={0.5}
            />
          ))}
          <rect x={27} y={52} width={34} height={12} rx={2} fill={COLOR.ink} opacity={0.14} />
          <rect
            x={40}
            y={70}
            width={22}
            height={13}
            rx={1.5}
            fill={COLOR.base}
            stroke={COLOR.edge}
            strokeWidth={0.8}
          />
          {BARCODE.map((index) => (
            <rect
              key={index}
              x={42.5 + index * 2}
              y={72.5}
              width={index % 3 ? 1 : 1.5}
              height={8}
              fill={COLOR.bar}
            />
          ))}
        </>
      )}
      {shot === "side" && (
        <>
          <path d="M8 106H82" stroke={COLOR.floor} strokeWidth={1.5} strokeLinecap="round" />
          <rect
            x={22}
            y={30}
            width={13}
            height={76}
            rx={2}
            fill="none"
            stroke={COLOR.floor}
            strokeWidth={1.2}
            opacity={0.7}
          />
          <rect
            x={37}
            y={14}
            width={18}
            height={92}
            rx={2}
            fill={COLOR.cover}
            stroke={COLOR.edge}
            strokeWidth={1.5}
          />
          <rect x={44} y={24} width={4} height={48} rx={2} fill={COLOR.ink} />
          <rect x={43} y={80} width={6} height={6} rx={1} fill={COLOR.ink} opacity={0.6} />
          <rect x={37} y={96} width={18} height={3} fill={COLOR.edge} opacity={0.6} />
          <rect
            x={57}
            y={38}
            width={12}
            height={68}
            rx={2}
            fill="none"
            stroke={COLOR.floor}
            strokeWidth={1.2}
            opacity={0.7}
          />
        </>
      )}
    </svg>
  );
}
