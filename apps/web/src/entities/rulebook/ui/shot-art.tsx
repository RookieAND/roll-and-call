import type { CertShot } from "../model/cert-shot";

const COLOR = {
  cover: "var(--rc-color-bg-primary-weak)",
  edge: "var(--rc-color-border-primary)",
  ink: "var(--rc-color-fg-primary)",
  paper: "var(--rc-color-bg-notice-weak)",
  paperEdge: "var(--rc-color-border-notice)",
  pen: "var(--rc-color-fg-notice)",
  bar: "var(--rc-color-fg-muted)",
  base: "var(--rc-color-bg-canvas-base)",
} as const;

const BACK_LINES = [22, 29, 36, 43] as const;
const BARCODE = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
// 두 권을 나란히 놓을 때는 쪽지를 책 아래로 빼지 않고 책 아랫부분에 겹쳐 그림 높이를 줄인다.
const PAIRED_NOTE_OFFSET = "translate(-2 -26)";
const PAIRED_VIEW_BOX = "0 12 90 74";
const SINGLE_VIEW_BOX = "0 0 90 120";
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

interface ShotArtProps {
  shot: CertShot;
  paired?: boolean;
}

export function ShotArt({ shot, paired = false }: ShotArtProps) {
  const book = shot === "front" ? FRONT_COVER : BACK_COVER;
  return (
    <svg
      viewBox={paired ? PAIRED_VIEW_BOX : SINGLE_VIEW_BOX}
      width="100%"
      height="100%"
      aria-hidden
      className="block"
    >
      {paired
        ? PAIR_TRANSFORMS.map((transform) => (
            <g key={transform} transform={transform}>
              {book}
            </g>
          ))
        : book}
      {shot === "front" &&
        (paired ? <g transform={PAIRED_NOTE_OFFSET}>{NICKNAME_NOTE}</g> : NICKNAME_NOTE)}
    </svg>
  );
}
