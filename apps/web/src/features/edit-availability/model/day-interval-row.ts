import type { AvailabilityInterval } from "@/entities/profile";

// 저장 배열에서의 자리(index)를 들고 다녀야 그 구간만 고치고 지울 수 있다.
export type DayIntervalRow = { index: number; interval: AvailabilityInterval };
