import type { CertProof } from "../model/cert-proof";

// 전자책 구매 내역·영수증 예시. 사진 예시(ShotArt)와 같은 역할 토큰으로 칠한다.
const COLOR = {
  cover: "var(--rc-color-bg-primary-weak)",
  edge: "var(--rc-color-border-primary)",
  ink: "var(--rc-color-fg-primary)",
  floor: "var(--rc-color-border-strong)",
  bar: "var(--rc-color-fg-muted)",
  base: "var(--rc-color-bg-canvas-base)",
} as const;

const RECEIPT_LINES = [28, 34, 40] as const;

interface ProofArtProps {
  proof: CertProof;
}

export function ProofArt({ proof }: ProofArtProps) {
  return (
    <svg
      viewBox="0 0 90 90"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className="block"
    >
      {proof === "order" ? (
        <>
          <rect
            x={18}
            y={8}
            width={54}
            height={74}
            rx={3}
            fill={COLOR.base}
            stroke={COLOR.floor}
            strokeWidth={1.5}
          />
          <rect x={24} y={15} width={24} height={4} rx={2} fill={COLOR.bar} opacity={0.7} />
          <rect x={24} y={26} width={42} height={3} rx={1.5} fill={COLOR.bar} opacity={0.35} />
          <rect x={24} y={33} width={42} height={3} rx={1.5} fill={COLOR.bar} opacity={0.35} />
          <rect
            x={22}
            y={42}
            width={46}
            height={16}
            rx={2}
            fill={COLOR.cover}
            stroke={COLOR.edge}
            strokeWidth={1}
          />
          <rect x={26} y={46} width={10} height={8} rx={1} fill={COLOR.ink} opacity={0.6} />
          <rect x={39} y={47} width={24} height={3} rx={1.5} fill={COLOR.ink} />
          <rect x={39} y={52} width={16} height={2.5} rx={1.2} fill={COLOR.ink} opacity={0.55} />
          <rect x={24} y={64} width={30} height={3} rx={1.5} fill={COLOR.bar} opacity={0.35} />
          <rect x={24} y={70} width={30} height={3} rx={1.5} fill={COLOR.bar} opacity={0.35} />
        </>
      ) : (
        <>
          <path
            d="M26 8h38v74l-4.75-3-4.75 3-4.75-3-4.75 3-4.75-3-4.75 3-4.75-3L26 82Z"
            fill={COLOR.base}
            stroke={COLOR.floor}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <rect x={33} y={16} width={24} height={4} rx={2} fill={COLOR.bar} opacity={0.7} />
          {RECEIPT_LINES.map((y) => (
            <g key={y}>
              <rect x={32} y={y} width={18} height={3} rx={1.5} fill={COLOR.bar} opacity={0.35} />
              <rect x={53} y={y} width={6} height={3} rx={1.5} fill={COLOR.bar} opacity={0.35} />
            </g>
          ))}
          <path d="M32 50h26" stroke={COLOR.floor} strokeWidth={1} strokeDasharray="2 2" />
          <rect x={32} y={56} width={12} height={4} rx={2} fill={COLOR.ink} />
          <rect x={47} y={56} width={12} height={4} rx={2} fill={COLOR.ink} />
        </>
      )}
    </svg>
  );
}
