import { ATTENDANCE_SELECT_PREFIX } from "@roll-and-call/game-notices";

import type { DiscordInteraction, DiscordSelectOption } from "./interaction-types";

// 출석 입력 메시지에 붙어 있는 셀렉트의 선택지. 고른 사람은 default가 true인 선택지다.
export function attendanceSelectOptions(interaction: DiscordInteraction): DiscordSelectOption[] {
  const components = interaction.message?.components?.flatMap((row) => row.components ?? []) ?? [];
  const select = components.find((component) =>
    component.custom_id?.startsWith(ATTENDANCE_SELECT_PREFIX),
  );
  return select?.options ?? [];
}
