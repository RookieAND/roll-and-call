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
// 두 권이면 책을 줄여 나란히 놓는다.
const PAIR_TRANSFORMS = ["translate(-4 16) scale(.6)", "translate(38 16) scale(.6)"] as const;

const COVER = (
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
);

const FRONT_COVER = (
  <>
    {COVER}
    <rect x={18} y={12} width={6} height={78} fill={COLOR.edge} opacity={0.5} />
    <rect x={31} y={24} width={32} height={5} rx={2} fill={COLOR.ink} />
    <rect x={31} y={33} width={22} height={4} rx={2} fill={COLOR.ink} opacity={0.55} />
    <rect x={31} y={42} width={11} height={6} rx={2} fill={COLOR.ink} opacity={0.8} />
    <circle cx={47} cy={64} r={9} fill="none" stroke={COLOR.ink} strokeWidth={1.5} opacity={0.7} />
  </>
);

const BACK_COVER = (
  <>
    {COVER}
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
);

const NICKNAME_NOTE = (
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
);

// 책등 하나. x=0에 그려 두고 translate로 옮긴다.
const SPINE = (
  <>
    <rect
      x={0}
      y={14}
      width={18}
      height={92}
      rx={2}
      fill={COLOR.cover}
      stroke={COLOR.edge}
      strokeWidth={1.5}
    />
    <rect x={7} y={24} width={4} height={48} rx={2} fill={COLOR.ink} />
    <rect x={6} y={80} width={6} height={6} rx={1} fill={COLOR.ink} opacity={0.6} />
    <rect x={0} y={96} width={18} height={3} fill={COLOR.edge} opacity={0.6} />
  </>
);

// 가운데 책 양옆에 흐리게 선 다른 책들. [x, y, 너비]
const SHELF = {
  single: {
    spines: [37],
    neighbors: [
      [22, 30, 13],
      [57, 38, 12],
    ],
  },
  paired: {
    spines: [26, 46],
    neighbors: [
      [12, 30, 12],
      [66, 38, 12],
    ],
  },
} as const;

interface ShotArtProps {
  shot: CertShot;
  // 여러 권을 함께 신청하면 두 권을 나란히 그린다.
  paired?: boolean;
}

export function ShotArt({ shot, paired = false }: ShotArtProps) {
  const book = shot === "front" ? FRONT_COVER : BACK_COVER;
  const shelf = paired ? SHELF.paired : SHELF.single;
  return (
    <svg viewBox="0 0 90 120" width="100%" height="100%" aria-hidden className="block">
      {shot === "side" ? (
        <>
          <path d="M8 106H82" stroke={COLOR.floor} strokeWidth={1.5} strokeLinecap="round" />
          {shelf.neighbors.map(([x, y, width]) => (
            <rect
              key={x}
              x={x}
              y={y}
              width={width}
              height={106 - y}
              rx={2}
              fill="none"
              stroke={COLOR.floor}
              strokeWidth={1.2}
              opacity={0.7}
            />
          ))}
          {shelf.spines.map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              {SPINE}
            </g>
          ))}
        </>
      ) : (
        <>
          {paired
            ? PAIR_TRANSFORMS.map((transform) => (
                <g key={transform} transform={transform}>
                  {book}
                </g>
              ))
            : book}
          {shot === "front" && NICKNAME_NOTE}
        </>
      )}
    </svg>
  );
}
