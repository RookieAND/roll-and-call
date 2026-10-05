import { messageVariables, type MessageCaseKey } from "@roll-and-call/database/servers/model";
import { Skeleton } from "@roll-and-call/ui";
import type { ReactNode } from "react";

// 디스코드 화면을 흉내 내므로 앱 테마와 상관없이 디스코드 다크 색을 쓴다.
const DISCORD = {
  background: "#313338", // tokens-check-ignore
  embed: "#2b2d31", // tokens-check-ignore
  bar: "#4e5058", // tokens-check-ignore
  text: "#dbdee1", // tokens-check-ignore
  muted: "#b5bac1", // tokens-check-ignore
  brand: "#5865f2", // tokens-check-ignore
  link: "#00a8fc", // tokens-check-ignore
  mention: "rgba(88,101,242,.3)",
  mentionText: "#c9cdfb", // tokens-check-ignore
  unknownRole: "rgba(148,155,164,.25)",
} as const;

const SAMPLE: Record<string, string> = {
  "구인 제목": "달그림자 여관",
  GM: "새벽세시",
  룰: "피아스코",
  달: "9월",
};

function Mention({ children, unknown }: { children: ReactNode; unknown?: boolean }) {
  return (
    <span
      className="rounded-200 px-025 font-medium"
      style={{
        background: unknown ? DISCORD.unknownRole : DISCORD.mention,
        color: unknown ? DISCORD.muted : DISCORD.mentionText,
      }}
    >
      {children}
    </span>
  );
}

function renderHead({
  text,
  variables,
  guildRoleIds,
}: {
  text: string;
  variables: readonly string[];
  guildRoleIds?: string[];
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
        return SAMPLE[variable];
      }
      const roleId = part.match(/^<@&(\d+)>$/)?.[1];
      if (roleId) {
        const known = guildRoleIds?.includes(roleId) ?? false;
        return (
          <Mention key={index} unknown={!known}>
            {known ? "@역할" : "@알 수 없는 역할"}
          </Mention>
        );
      }
      return part.replace(/\s+/g, " ");
    });
}

function Bar({ width, height = 12 }: { width: number | string; height?: number }) {
  return (
    <span
      aria-hidden
      className="block rounded-200 opacity-55"
      style={{ width, height, background: DISCORD.bar }}
    />
  );
}

interface DiscordPreviewProps {
  caseKey: MessageCaseKey;
  text: string;
  guildRoleIds?: string[];
  loading?: boolean;
}

// 임베드와 버튼은 고치지 않는 자리라 막대로만 그린다. 변수는 예시 값으로 바꿔 보여 준다.
export function DiscordPreview({ caseKey, text, guildRoleIds, loading }: DiscordPreviewProps) {
  const nodes = loading
    ? null
    : renderHead({ text, variables: messageVariables(caseKey), guildRoleIds });
  const hasHead = nodes?.some((node) => typeof node !== "string" || node.trim());
  return (
    <div
      className="flex gap-150 rounded-400 px-200 py-150"
      style={{ background: DISCORD.background, color: DISCORD.text }}
    >
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full font-bold text-white"
        style={{ background: DISCORD.brand }}
      >
        R
      </span>
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
        <div
          className="mt-075 flex max-w-[420px] flex-col gap-100 rounded-200 border-l-4 px-150 pt-100 pb-150"
          style={{ background: DISCORD.embed, borderColor: DISCORD.bar }}
        >
          <Bar width="45%" height={14} />
          <Bar width="90%" />
          <Bar width="65%" />
          <div className="flex gap-150">
            <Bar width={72} />
            <Bar width={72} />
            <Bar width={72} />
          </div>
        </div>
      </div>
    </div>
  );
}
