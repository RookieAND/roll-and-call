import { directionalParticle } from "./directional-particle";
import { subjectParticle } from "./subject-particle";

export const CLOCK_PARTICLE_KIND = {
  subject: "subject",
  direction: "direction",
} as const;

export type ClockParticleKind = (typeof CLOCK_PARTICLE_KIND)[keyof typeof CLOCK_PARTICLE_KIND];

// 「HH:mm」 끝 숫자의 읽는 소리로 조사를 고른다(영·일·삼·육·칠·팔은 받침이 있다).
export function clockParticle({ clock, kind }: { clock: string; kind: ClockParticleKind }) {
  return kind === CLOCK_PARTICLE_KIND.subject ? subjectParticle(clock) : directionalParticle(clock);
}
