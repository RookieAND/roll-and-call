import type { Game } from "@roll-and-call/database";
import { formatPlayMinutes, RECRUIT_METHOD_LABEL } from "@roll-and-call/database/games/model";

import { inlineCodeTags } from "./inline-code-tags";
import { formatDateTime } from "./lib/format-date-time";
import { formatGameSchedule } from "./lib/format-game-schedule";
import { formatRecruitHeadcount } from "./lib/format-recruit-headcount";
import { richTextToMarkdown } from "./lib/rich-text-markdown";
import { splitMessage } from "./split-message";

const MESSAGE_LIMIT = 2000;

// 포럼 모집 글 본문. 항목은 한 줄씩, 개요는 그 아래에 이어 쓴다. 한 메시지(2000자)를 넘으면 뒤는 followUps로 나눠 같은 글 안에 이어 보낸다.
export function recruitPlainText({
  game,
  gmName,
  confirmedCount,
  cancelled = false,
  url,
  limit = MESSAGE_LIMIT,
}: {
  game: Game;
  gmName: string;
  confirmedCount: number;
  cancelled?: boolean;
  // 구인 상세 주소. 없으면 링크 줄을 뺀다.
  url?: string;
  // 머리 줄 등 본문 앞에 붙을 글자 수를 뺀 한 메시지 상한.
  limit?: number;
}): { content: string; followUps: string[] } {
  const method = RECRUIT_METHOD_LABEL[game.recruitMethod];
  const markdown = (value: string | null) =>
    // 빈 문단이 줄 바꿈으로 쌓이지 않게 연속 빈 줄은 하나로 줄인다.
    value ? richTextToMarkdown(value).replaceAll(/\n{3,}/g, "\n\n") : "";
  const overview = markdown(game.synopsis);
  const notice = markdown(game.notice);
  const section = (heading: string, body: string | undefined) =>
    body ? `${heading}\n${body}` : undefined;
  const item = (label: string, value: string) => `- **${label}**　${value}`;
  const tagItem = (label: string, values: string[]) =>
    values.length > 0 ? item(label, inlineCodeTags(values)) : undefined;
  // 트리거는 보고 싶지 않은 사람이 있으니 스포일러로 가린다. 코드 안의 ||는 문법이 아니라 가림막이 깨지지 않는다.
  const spoilerTags = (values: string[]) =>
    values.map((value) => `||${inlineCodeTags([value])}||`).join(" ");
  const list = (items: (string | undefined)[]) =>
    items.filter((value) => value !== undefined).join("\n");
  const text = [
    cancelled ? "> 🚫 **취소된 구인입니다**" : undefined,
    url ? `🔗 [구인글 상세 보기](${url})` : undefined,
    section(
      "## 📋 모집 정보",
      list([
        item("룰", game.rule),
        item("인원", `${formatRecruitHeadcount({ game, confirmedCount })} · ${method}`),
        item("GM", gmName),
      ]),
    ),
    section(
      "### 🗓️ 일정",
      list([
        item("시작", formatGameSchedule(game)),
        game.playMinutes ? item("플레이 시간", formatPlayMinutes(game.playMinutes)) : undefined,
        item("모집 마감", formatDateTime(game.endDate)),
      ]),
    ),
    section(
      "### 🎯 플레이 정보",
      list([
        item("진행 방식", game.playType === "text" ? "텍스트" : "보이스"),
        tagItem("장르", game.genres),
        tagItem("플랫폼", game.platforms),
        tagItem("AI 이미지", [game.aiImage ? "사용" : "사용 안 함"]),
      ]),
    ),
    section("### ⚠️ 트리거", game.triggers.length > 0 ? spoilerTags(game.triggers) : undefined),
    section("## 📖 개요", overview || undefined),
    section("## 📌 주의 사항", notice || undefined),
  ]
    .filter((block) => block !== undefined)
    .join("\n\n");
  const [content = "", ...followUps] = splitMessage({ text, limit });
  return { content, followUps };
}
