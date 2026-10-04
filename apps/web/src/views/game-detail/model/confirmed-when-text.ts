import { CLOCK_PARTICLE_KIND, clockParticle, formatDateTime, toKst } from "@/shared/lib";

// 「9월 16일 (수) 20:00으로」: 시각 끝 숫자의 읽는 소리로 조사를 고른다.
export function confirmedWhenText(confirmedAt: Date) {
  const clock = toKst(confirmedAt).format("HH:mm");
  return `${formatDateTime(confirmedAt)}${clockParticle({ clock, kind: CLOCK_PARTICLE_KIND.direction })}`;
}
