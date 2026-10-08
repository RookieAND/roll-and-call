import { DISCORD } from "@/shared/lib";

const SECTIONS = [
  {
    heading: "📋 모집 정보",
    large: true,
    items: [
      ["룰", "피아스코"],
      ["인원", "4/5명 · 선착순"],
      ["GM", "@새벽세시"],
    ],
  },
  {
    heading: "🗓️ 일정",
    items: [
      ["시작", "9월 27일 (일) 20:00"],
      ["모집 마감", "9월 25일 (금) 23:59"],
    ],
  },
];

// 구인 개설은 임베드 없이 머리 줄 아래에 평문 본문과 버튼이 붙는다. 본문은 고칠 수 없는 자리다.
export function PreviewPlain() {
  return (
    <div className="mt-050 flex flex-col gap-050 leading-[22px]">
      {SECTIONS.map(({ heading, large, items }) => (
        <div key={heading}>
          <div className={large ? "text-body3 font-bold text-white" : "font-bold text-white"}>
            {heading}
          </div>
          {items.map(([label, value]) => (
            <div key={label}>
              • <b className="text-white">{label}</b>　{value}
            </div>
          ))}
        </div>
      ))}
      <span
        className="mt-050 w-fit rounded-200 px-150 py-050 text-body4 font-semibold text-white"
        style={{ background: DISCORD.bar }}
      >
        📄 구인글 상세보기
      </span>
    </div>
  );
}
