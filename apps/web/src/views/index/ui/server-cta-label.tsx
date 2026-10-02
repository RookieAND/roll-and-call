import type { ServerCtaMode } from "../model/server-cta-mode";

interface ServerCtaLabelProps {
  name: string;
  mode: ServerCtaMode;
  compact: boolean;
}

const LABELS = {
  member: {
    full: (name: string) => `${name} 구인 보러 가기`,
    compact: (name: string) => `${name} 구인 보러 가기`,
    narrow: "구인 보기",
  },
  join: {
    full: (name: string) => `${name}에서 롤앤콜 시작하기`,
    compact: (name: string) => `${name}에서 시작하기`,
    narrow: "시작하기",
  },
} as const;

// 헤더에 붙는 작은 버튼은 좁은 화면에서 서버 이름을 빼고 줄인다.
export function ServerCtaLabel({ name, mode, compact }: ServerCtaLabelProps) {
  const labels = LABELS[mode];
  if (!compact) return <span className="min-w-0 truncate">{labels.full(name)}</span>;
  return (
    <>
      <span className="min-w-0 truncate @max-2xl:hidden">{labels.compact(name)}</span>
      <span className="@2xl:hidden">{labels.narrow}</span>
    </>
  );
}
