import { CAPACITY_ACTION, type CapacityAction } from "./capacity-action";

export type CapacityDecision = { error: string } | { raise: boolean };

// 정원은 확정만 센다. 세션 시작 전에는 넘으면 거부, 시작 뒤에는 한 번만 1명 늘려 넣을 수 있다.
export function capacityDecision({
  action,
  started,
  confirmedCount,
  maxPlayers,
  addingCount,
  raiseCapacity,
  alreadyRaised,
}: {
  action: CapacityAction;
  started: boolean;
  confirmedCount: number;
  maxPlayers: number;
  addingCount: number;
  raiseCapacity: boolean;
  alreadyRaised: boolean;
}): CapacityDecision {
  const fits = confirmedCount + addingCount <= maxPlayers;
  if (!started) {
    if (raiseCapacity) return { error: "세션이 시작된 뒤에만 정원을 늘릴 수 있습니다." };
    if (fits) return { raise: false };
    if (action === CAPACITY_ACTION.promote) {
      return {
        error: `정원 ${maxPlayers}명이 차 있습니다. 확정에서 한 명을 대기로 옮겨 주세요.`,
      };
    }
    return { error: `남은 자리가 ${Math.max(maxPlayers - confirmedCount, 0)}자리뿐입니다.` };
  }
  if (fits) return { raise: false };
  if (!raiseCapacity) return { error: `정원 ${maxPlayers}명이 차 있습니다.` };
  if (alreadyRaised) return { error: "이미 정원을 한 번 늘렸습니다." };
  if (addingCount > 1) return { error: "정원을 늘릴 때는 1명만 넣을 수 있습니다." };
  if (confirmedCount + addingCount > maxPlayers + 1) {
    return { error: `정원 ${maxPlayers}명이 차 있습니다.` };
  }
  return { raise: true };
}
