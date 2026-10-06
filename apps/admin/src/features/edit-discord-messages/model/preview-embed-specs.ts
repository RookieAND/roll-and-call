import type { MessageCaseKey } from "@roll-and-call/database/servers/model";

import { DISCORD } from "./discord-theme";

interface PreviewField {
  name: string;
  value: string;
  inline: boolean;
}

export interface PreviewEmbedSpec {
  emoji: string;
  color: string;
  // 제목이 링크가 아닌 알림(구인 취소).
  unlinked?: boolean;
  // 설명 문장 뒤에 항상 붙는 고정 문구.
  descriptionSuffix?: string;
  fields: PreviewField[];
  footer?: string;
  button?: string;
}

const HEADCOUNT: PreviewField[] = [
  { name: "📌 상태", value: "모집 중", inline: true },
  { name: "👥 인원", value: "4/5명", inline: true },
  { name: "⏳ 대기", value: "2명", inline: true },
];

const SESSION_TIME: PreviewField = { name: "🕒 시간", value: "9월 27일 (일) 20:00", inline: true };

// 코드가 실제로 보내는 임베드(제목 이모지·색·칸·버튼)와 같게 둔다. 임베드를 안 쓰는 이달의 GM·PL은 없고, 구인 개설은 OPEN_EMBED_SPEC이다.
export const PREVIEW_EMBED_SPECS: Partial<Record<MessageCaseKey, PreviewEmbedSpec>> = {
  apply: { emoji: "🙋", color: DISCORD.confirmed, fields: HEADCOUNT },
  leave: { emoji: "🚪", color: DISCORD.left, fields: HEADCOUNT },
  direct: { emoji: "✅", color: DISCORD.confirmed, fields: HEADCOUNT },
  draw: {
    emoji: "🎲",
    color: DISCORD.complete,
    descriptionSuffix:
      "자리가 나면 GM이 대기 명단에서 확정해요. 내 1d100 값은 링크에서 확인하세요.",
    fields: [
      { name: "✅ 확정 3명", value: "@탐정놀이중\n@달빛토끼\n@김코코", inline: false },
      { name: "⏳ 대기 2명", value: "@모험가A\n@모험가B", inline: false },
    ],
    button: "🎲 추첨 결과 보기",
  },
  time: {
    emoji: "🗓️",
    color: DISCORD.confirmed,
    fields: [SESSION_TIME, ...HEADCOUNT],
    button: "🕒 세션 확인하기",
  },
  done: {
    emoji: "🎉",
    color: DISCORD.complete,
    fields: [
      { name: "📜 룰", value: "피아스코", inline: true },
      ...HEADCOUNT,
      { ...SESSION_TIME, inline: false },
      { name: "🙋 참여자", value: "@탐정놀이중, @달빛토끼, @김코코", inline: false },
    ],
  },
  remind: {
    emoji: "⏰",
    color: DISCORD.recruit,
    fields: [{ name: "📜 룰", value: "피아스코", inline: true }, SESSION_TIME],
  },
  cancel: { emoji: "🚫", color: DISCORD.cancelled, unlinked: true, fields: [] },
};

// 텍스트 채널 모집 글. 포럼이면 평문이라 이 임베드는 쓰지 않는다.
export const OPEN_EMBED_SPEC: PreviewEmbedSpec = {
  emoji: "🎲",
  color: DISCORD.recruit,
  fields: [
    { name: "📜 룰", value: "피아스코", inline: true },
    { name: "👥 인원", value: "4/5명", inline: true },
    { name: "🎯 방식", value: "선착순", inline: true },
    { ...SESSION_TIME, inline: false },
  ],
  footer: "GM 새벽세시 · 마감 9/25",
  button: "▶ 참여하러 가기",
};
