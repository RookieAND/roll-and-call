import type { Game } from "@/shared/server";

// 수정은 저장된 글을, 다음 회차 등록은 일정만 비운 이전 회차를 채운다.
export type GameDefaults = Omit<Game, "endDate"> & { endDate?: Date };
