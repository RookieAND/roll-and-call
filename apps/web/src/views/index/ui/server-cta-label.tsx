interface ServerCtaLabelProps {
  name: string;
  compact: boolean;
}

// 헤더에 붙는 작은 버튼은 좁은 화면에서 서버 이름을 빼고 줄인다.
export function ServerCtaLabel({ name, compact }: ServerCtaLabelProps) {
  const fullLabel = `${name} 구인 보러 가기`;
  if (!compact) return <span className="min-w-0 truncate">{fullLabel}</span>;
  return (
    <>
      <span className="min-w-0 truncate @max-2xl:hidden">{fullLabel}</span>
      <span className="@2xl:hidden">구인 보기</span>
    </>
  );
}
