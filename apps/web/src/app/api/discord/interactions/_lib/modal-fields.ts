import type { DiscordInteraction, DiscordModalField } from "./interaction-types";

// 모달 제출에서 입력 칸만 꺼낸다. 안내 글(Text Display)은 component가 없어 빠진다.
export function modalFields(interaction: DiscordInteraction): DiscordModalField[] {
  return interaction.data?.components?.flatMap(({ component }) => component ?? []) ?? [];
}
