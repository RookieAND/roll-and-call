import { Text } from "@trpg/ui";

// 지금은 누르지 않는다. 같은 성향으로 사람을 찾는 화면이 없고, 구인 태그와 섞이면 같은 모양이 둘을 뜻한다.
export function KeywordChips({ keywords }: { keywords: readonly string[] }) {
  if (keywords.length === 0) {
    return (
      <div className="flex min-h-11 items-center gap-2 rounded-[11px] border border-dashed border-gray-300 px-3">
        <Text typography="body3" foreground="hint" className="flex-none font-bold">
          #
        </Text>
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1 text-[12.5px]">
          적어둔 성향이 없습니다
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {keywords.map((keyword) => (
        <span
          key={keyword}
          className="flex h-8 items-center rounded-full border border-primary-200 bg-primary-50 px-[11px] text-[13px] font-bold text-primary-ink"
        >
          #{keyword}
        </span>
      ))}
    </div>
  );
}
