import { Text } from "@trpg/ui";

import { GAME_STATUS, GameStatusBadge } from "@/entities/game";
import { BrandMark, LINK_SERVICES } from "@/entities/profile";
import { HeatSample } from "@/shared/ui";

import { HELP_FIGURE, type HelpFigureKey } from "../model/help-docs";

const SAMPLE_FIELDS = [
  { label: "게임명", value: "물벼락 — 1부" },
  { label: "룰", value: "크툴루의 부름" },
  { label: "플레이 시간", value: "3시간" },
];
const SAMPLE_ROSTER = [
  { name: "서리", state: "확정" },
  { name: "모래", state: "대기 1번" },
];

// ponytail: 시안의 "실제 화면 조각"을 설명용으로 축소한 그림이다. 장식이라 누를 수 있는 것은 하나도 없다.
export function HelpFigure({ figure }: { figure: HelpFigureKey }) {
  if (figure === HELP_FIGURE.heatGrid) {
    return (
      <div className="rounded-[11px] border border-gray-200 bg-gray-50 p-3">
        <HeatSample />
      </div>
    );
  }

  if (figure === HELP_FIGURE.gameList) {
    return (
      <div className="flex flex-col gap-2.5 rounded-[11px] border border-gray-200 bg-gray-50 p-2.5">
        <div className="flex flex-wrap gap-1.5">
          <GameStatusBadge status={GAME_STATUS.recruiting} />
          <GameStatusBadge status={GAME_STATUS.confirmed} />
          <GameStatusBadge status={GAME_STATUS.closed} />
        </div>
        <div className="flex items-center gap-2.5 rounded-[9px] border border-gray-200 bg-surface px-2.5 py-2">
          <span className="size-[34px] flex-none rounded-lg bg-tinted-bg" />
          <span className="min-w-0 flex-1">
            <Text typography="subtitle1" render={<span />} className="block truncate">
              물벼락 — 1부
            </Text>
            <Text typography="body4" foreground="muted" render={<span />} className="mt-0.5 block">
              GM 라온 · 확정 2 · 정원 4
            </Text>
          </span>
        </div>
      </div>
    );
  }

  if (figure === HELP_FIGURE.formFields) {
    return (
      <div className="flex flex-col gap-2.5 rounded-[11px] border border-gray-200 bg-gray-50 p-2.5">
        {SAMPLE_FIELDS.map((field) => (
          <div key={field.label}>
            <Text typography="body4" foreground="muted" render={<span />} className="block">
              {field.label}
            </Text>
            <div className="mt-1 flex h-[38px] items-center rounded-[10px] border border-gray-200 bg-surface px-2.5">
              <Text typography="body3" render={<span />} className="truncate">
                {field.value}
              </Text>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (figure === HELP_FIGURE.rosterRows) {
    return (
      <div className="flex flex-col gap-1.5 rounded-[11px] border border-gray-200 bg-gray-50 p-2.5">
        {SAMPLE_ROSTER.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-2.5 rounded-[9px] border border-gray-200 bg-surface px-2.5 py-2"
          >
            <span className="size-[30px] flex-none rounded-full bg-tinted-bg" />
            <Text typography="subtitle1" render={<span />} className="flex-1">
              {member.name}
            </Text>
            <Text typography="body4" foreground="muted" render={<span />}>
              {member.state}
            </Text>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {LINK_SERVICES.filter((service) => service.key !== "link").map((service) => (
        <span
          key={service.key}
          title={service.label}
          className="flex size-[34px] items-center justify-center rounded-[10px] border border-gray-200 text-gray-700"
        >
          <BrandMark service={service.key} size={16} />
        </span>
      ))}
    </div>
  );
}
