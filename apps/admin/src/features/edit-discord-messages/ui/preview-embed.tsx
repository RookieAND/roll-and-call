import type { ReactNode } from "react";

import { DISCORD } from "@/shared/lib";

import type { PreviewEmbedSpec } from "../model/preview-embed-specs";

interface PreviewEmbedProps {
  spec: PreviewEmbedSpec;
  // 설명 문장 자리. 없으면 막대로 그린다.
  description?: ReactNode;
}

// 알림마다 제목 이모지·색·칸·버튼이 다르므로 spec대로 그린다. 칸 값과 버튼은 고칠 수 없는 자리다.
export function PreviewEmbed({ spec, description }: PreviewEmbedProps) {
  return (
    <div
      className="mt-075 flex max-w-105 flex-col gap-100 rounded-200 border-l-4 px-150 pt-100 pb-150"
      style={{ background: DISCORD.embed, borderColor: spec.color }}
    >
      <span className="font-semibold" style={spec.unlinked ? undefined : { color: DISCORD.link }}>
        {spec.emoji} 달그림자 여관
      </span>
      {description ? (
        <div className="text-body3 leading-5 whitespace-pre-line wrap-anywhere">
          {description}
          {spec.descriptionSuffix ? `\n${spec.descriptionSuffix}` : null}
        </div>
      ) : (
        <span
          aria-hidden
          className="block h-3 w-[90%] rounded-200 opacity-55"
          style={{ background: DISCORD.bar }}
        />
      )}
      {spec.fields.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-150 gap-y-100 text-body4">
          {spec.fields.map((field) => (
            <div key={field.name} className={field.inline ? "" : "col-span-3 whitespace-pre-line"}>
              <div className="font-semibold text-white">{field.name}</div>
              <div>{field.value}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-075 text-body4" style={{ color: DISCORD.muted }}>
        <span>{spec.footer ?? "GM 새벽세시"}</span>
      </div>
      {spec.button ? (
        <span
          className="w-fit rounded-200 px-150 py-050 text-body4 font-semibold text-white"
          style={{ background: DISCORD.bar }}
        >
          {spec.button}
        </span>
      ) : null}
    </div>
  );
}
