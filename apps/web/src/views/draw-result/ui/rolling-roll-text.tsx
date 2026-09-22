"use client";

import { useRollingNumbers } from "../model/use-rolling-numbers";
import { DrawRollText } from "./draw-roll-text";

interface RollingRollTextProps {
  roll: number;
  onceKey: string;
  emphasized: boolean;
}

// 알림을 눌러 처음 들어오면 내 값만 0.4초 돌다 멈춘다. 두 번째 방문부터는 처음부터 적혀 있다.
export function RollingRollText({ roll, onceKey, emphasized }: RollingRollTextProps) {
  const {
    values: [shown],
  } = useRollingNumbers([roll], { durationMs: 400, onceKey });

  return <DrawRollText value={shown!} emphasized={emphasized} strong />;
}
