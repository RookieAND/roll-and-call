import { Chip, Text } from "@trpg/ui";
import Link from "next/link";
import type { SessionTab } from "@/widgets/session-list";

// 세션 목록 상단 필터 줄(스크롤 시 앱바 아래 고정). 칩은 탭 전환 링크.
// 선택 칩은 시안대로 검정 배경. 정렬은 옵션이 하나뿐이라 정적 라벨.
export function SessionTabFilter({
  tabs,
  active,
  hrefFor,
}: {
  tabs: readonly SessionTab[];
  active: string;
  hrefFor: (key: string) => string;
}) {
  return (
    <div className="sticky top-[52px] z-10 flex items-center gap-2 border-b border-gray-100 bg-surface/90 px-4 py-2.5 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const selected = tab.key === active;
          return (
            <Chip
              key={tab.key}
              asChild
              selected={selected}
              className={selected ? "border-[#17171C] bg-[#17171C] text-white" : undefined}
            >
              <Link href={hrefFor(tab.key)} aria-current={selected ? "page" : undefined}>
                {tab.label}
              </Link>
            </Chip>
          );
        })}
      </div>
      <span className="flex-1" />
      {/* ponytail: 정렬은 "가까운 순" 하나뿐 → 정적 라벨. 2번째 옵션 생기면 Select로 교체 */}
      <Text
        typography="body4"
        foreground="muted"
        className="shrink-0 whitespace-nowrap font-semibold"
      >
        가까운 순 ▾
      </Text>
    </div>
  );
}
