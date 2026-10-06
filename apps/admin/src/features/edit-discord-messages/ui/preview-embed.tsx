import type { ReactNode } from "react";

import { DISCORD } from "../model/discord-theme";

const FIELDS = [
  { name: "📜 룰", value: "피아스코", inline: true },
  { name: "👥 인원", value: "4/5명", inline: true },
  { name: "⏳ 대기", value: "2명", inline: true },
  { name: "🕒 시간", value: "9월 27일 (일) 20:00", inline: false },
];

interface PreviewEmbedProps {
  // 설명 문장 자리. 없으면 막대로 그린다.
  description?: ReactNode;
}

// 모든 알림이 같은 틀을 쓰므로 한 가지 예시 임베드로 보여 준다. 칸 값과 버튼은 고칠 수 없는 자리다.
export function PreviewEmbed({ description }: PreviewEmbedProps) {
  return (
    <div
      className="mt-075 flex max-w-[420px] flex-col gap-100 rounded-200 border-l-4 px-150 pt-100 pb-150"
      style={{ background: DISCORD.embed, borderColor: DISCORD.confirmed }}
    >
      <span className="font-semibold" style={{ color: DISCORD.link }}>
        🎲 달그림자 여관
      </span>
      {description ? (
        <div className="text-body3 leading-[20px] whitespace-pre-line [overflow-wrap:anywhere]">
          {description}
        </div>
      ) : (
        <span
          aria-hidden
          className="block h-3 w-[90%] rounded-200 opacity-55"
          style={{ background: DISCORD.bar }}
        />
      )}
      <div className="grid grid-cols-3 gap-x-150 gap-y-100 text-body4">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.inline ? "" : "col-span-3"}>
            <div className="font-semibold text-white">{field.name}</div>
            <div>{field.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-075 text-body4" style={{ color: DISCORD.muted }}>
        <span>GM 새벽세시</span>
      </div>
      <span
        className="w-fit rounded-200 px-150 py-050 text-body4 font-semibold text-white"
        style={{ background: DISCORD.bar }}
      >
        ▶ 참여하러 가기
      </span>
    </div>
  );
}
