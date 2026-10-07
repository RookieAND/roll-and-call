import {
  messageTextVariables,
  messageVariables,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { Skeleton } from "@roll-and-call/ui";
import Image from "next/image";

import { DISCORD } from "@/shared/lib";

import type { MessageRole } from "../model/message-role";
import { OPEN_EMBED_SPEC, PREVIEW_EMBED_SPECS } from "../model/preview-embed-specs";
import { Mention } from "./discord-mention";
import { PreviewEmbed } from "./preview-embed";
import { PreviewMonthly } from "./preview-monthly";
import { PreviewPlain } from "./preview-plain";

const SAMPLE: Record<string, string> = {
  "구인 제목": "달그림자 여관",
  GM: "새벽세시",
  룰: "피아스코",
  달: "9월",
  참여자: "@탐정놀이중",
  확정자: "@탐정놀이중, @달빛토끼",
  "신청 수": "7",
  "확정 수": "4",
};

function renderHead({
  text,
  variables,
  guildRoles,
}: {
  text: string;
  variables: readonly string[];
  guildRoles?: MessageRole[];
}) {
  return text
    .split(/(\{[^}]+\}|<@&\d+>)/)
    .filter((part) => part !== "")
    .map((part, index) => {
      const variable = part.match(/^\{(.+)\}$/)?.[1];
      if (variable && variables.includes(variable)) {
        if (variable === "참여자 멘션") {
          return (
            <span key={index}>
              <Mention>@탐정놀이중</Mention> <Mention>@달빛토끼</Mention> <Mention>@김코코</Mention>
            </span>
          );
        }
        if (variable === "링크") {
          return (
            <span key={index} style={{ color: DISCORD.link }}>
              https://discord.com/channels/…
            </span>
          );
        }
        if (variable === "참여자") return <Mention key={index}>@탐정놀이중</Mention>;
        if (variable === "확정자") {
          return (
            <span key={index}>
              <Mention>@탐정놀이중</Mention>, <Mention>@달빛토끼</Mention>
            </span>
          );
        }
        return SAMPLE[variable];
      }
      const roleId = part.match(/^<@&(\d+)>$/)?.[1];
      if (roleId) {
        const role = guildRoles?.find((candidate) => candidate.id === roleId);
        const unknown = guildRoles !== undefined && !role;
        return (
          <Mention key={index} unknown={unknown}>
            {unknown ? "@알 수 없는 역할" : `@${role?.name ?? "역할"}`}
          </Mention>
        );
      }
      return part.replace(/\s+/g, " ");
    });
}

interface DiscordPreviewProps {
  caseKey: MessageCaseKey;
  text: string;
  // 임베드 설명 문장 미리보기. 없으면 막대로 그린다.
  description?: { key: MessageTextKey; text: string };
  // 머리 줄 아래, 임베드 위에 붙는 본문 줄 미리보기.
  bodyLine?: { key: MessageTextKey; text: string };
  guildRoles?: MessageRole[];
  // 모집 채널이 포럼이면 구인 개설이 평문으로 나간다.
  recruitForum?: boolean;
  loading?: boolean;
}

// 경우마다 실제로 나가는 모양(평문 또는 임베드의 칸·푸터·버튼)으로 보여 주고 설명 문장만 바꿔 끼운다. 변수는 예시 값으로 바꾼다.
export function DiscordPreview({
  caseKey,
  text,
  description,
  bodyLine,
  guildRoles,
  recruitForum = false,
  loading,
}: DiscordPreviewProps) {
  const nodes = loading
    ? null
    : renderHead({ text, variables: messageVariables(caseKey), guildRoles });
  const hasHead = nodes?.some((node) => typeof node !== "string" || node.trim());
  const descriptionNodes = description
    ? renderHead({
        text: description.text,
        variables: messageTextVariables(description.key),
        guildRoles,
      })
    : null;
  const bodyNodes = bodyLine
    ? renderHead({
        text: bodyLine.text,
        variables: messageTextVariables(bodyLine.key),
        guildRoles,
      })
    : null;
  const embedSpec =
    caseKey === "open" && !recruitForum ? OPEN_EMBED_SPEC : PREVIEW_EMBED_SPECS[caseKey];
  return (
    <div
      className="flex gap-150 rounded-400 px-200 py-150"
      style={{ background: DISCORD.background, color: DISCORD.text }}
    >
      <Image
        src="/discord-bot.png"
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-075 leading-[22px]">
          <span className="font-semibold text-white">롤앤콜</span>
          <span
            className="rounded-200 px-050 text-body4 font-semibold text-white"
            style={{ background: DISCORD.brand }}
          >
            봇
          </span>
          <span className="text-body4" style={{ color: DISCORD.muted }}>
            오늘 오후 2:38
          </span>
        </div>
        {loading ? <Skeleton width="70%" height={14} className="mt-075" /> : null}
        {hasHead ? <div className="leading-[22px] [overflow-wrap:anywhere]">{nodes}</div> : null}
        {bodyNodes ? (
          <div className="leading-[22px] [overflow-wrap:anywhere]">{bodyNodes}</div>
        ) : null}
        {caseKey === "open" && recruitForum ? <PreviewPlain /> : null}
        {caseKey === "monthly" ? <PreviewMonthly /> : null}
        {embedSpec ? <PreviewEmbed spec={embedSpec} description={descriptionNodes} /> : null}
      </div>
    </div>
  );
}
