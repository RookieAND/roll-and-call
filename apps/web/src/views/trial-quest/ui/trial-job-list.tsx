import { Container, VStack } from "@roll-and-call/ui";

import { GameCard } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { AppBar, ServerLink } from "@/shared/ui";

import { buildTrialGame } from "../model/build-trial-game";
import { TRIAL_KIND, type TrialKind } from "../model/trial-kind";
import { TrialBanner } from "./trial-banner";

interface TrialJobListProps {
  applied: Partial<Record<TrialKind, true>>;
  now: Date;
  // 방금 내가 등록한 체험 구인. 맨 앞에 보인다.
  mine?: GameDetailData | null;
}

export function TrialJobList({ applied, now, mine = null }: TrialJobListProps) {
  const others = [TRIAL_KIND.firstCome, TRIAL_KIND.lottery].map((kind) =>
    buildTrialGame({ kind, applied: Boolean(applied[kind]), now }),
  );
  const games = mine ? [mine, ...others] : others;
  return (
    <>
      <AppBar title="구인 목록" />
      <TrialBanner />
      <Container size="md">
        <VStack gap="125" className="py-200">
          {games.map((game) => (
            <ServerLink key={game.id} path={`/games/${game.id}`} className="block h-full">
              <GameCard game={game} />
            </ServerLink>
          ))}
        </VStack>
      </Container>
    </>
  );
}
