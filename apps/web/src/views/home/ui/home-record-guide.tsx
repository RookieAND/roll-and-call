"use client";

import {
  ABSENCE_POINTS,
  CROWD_BASE_PLAYERS,
  CROWD_BONUS_PLAYERS,
  CROWD_BONUS_POINTS,
  REVIEW_POINTS,
  SESSION_POINTS,
} from "@roll-and-call/database/badges/model";
import { Sheet, Text } from "@roll-and-call/ui";
import { Info } from "lucide-react";

const NOTES = [
  "동점이면 그 점수에 먼저 도달한 사람이 앞섭니다.",
  "0점 이하는 순위에 오르지 않습니다.",
  "타이만(1:1) 세션은 순위에 세지 않습니다.",
] as const;

const RULES: { label: string; value: string }[] = [
  { label: "정식 룰 세션", value: `${SESSION_POINTS.regular}점` },
  { label: "미니룰 세션", value: `${SESSION_POINTS.mini}점` },
  {
    label: `GM 가점 (플레이어 ${CROWD_BASE_PLAYERS}명 초과 1명마다, 최대 ${CROWD_BONUS_POINTS * CROWD_BONUS_PLAYERS}점)`,
    value: `+${CROWD_BONUS_POINTS}점`,
  },
  { label: "세션 후기 1건 (쓴 사람, 받은 GM)", value: `${REVIEW_POINTS}점` },
  { label: "불참", value: `${ABSENCE_POINTS}점` },
];

// 포인트제 서버에서만 보인다. 순위를 매기는 점수 기준을 시트로 알려 준다.
export function HomeRecordGuide() {
  return (
    <Sheet.Root>
      <Sheet.Trigger
        aria-label="점수 기준 보기"
        className="inline-flex size-6 items-center justify-center rounded-full text-hint hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
      >
        <Info size={16} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-075 text-heading3">점수 기준</Sheet.Title>
        <Sheet.Body>
          <div className="mb-125">
            <Text typography="body4" foreground="muted" render={<p />}>
              세션 점수와 후기 점수, 불참 점수로 이 달의 순위를 정합니다.
            </Text>
            <ul className="mt-050 list-inside list-disc space-y-050">
              {NOTES.map((note) => (
                <Text key={note} typography="body4" foreground="muted" render={<li />}>
                  {note}
                </Text>
              ))}
            </ul>
          </div>
          <ul className="divide-y divide-gray-100">
            {RULES.map((rule) => (
              <li
                key={rule.label}
                className="flex items-center justify-between gap-150 px-100 py-125"
              >
                <Text typography="body3" className="break-keep">
                  {rule.label}
                </Text>
                <Text typography="body3" weight="extrabold" numeric className="flex-none">
                  {rule.value}
                </Text>
              </li>
            ))}
          </ul>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
