import { BADGE_ROLE } from "@roll-and-call/database/badges/model";
import { Text } from "@roll-and-call/ui";

import { ATTENDANCE_HINT } from "@/entities/badge";

import type { DexTab } from "../model/build-dex-tab";
import { DexGridSection } from "./dex-grid-section";
import { DexLadderTrack } from "./dex-ladder-track";
import { DexMonthlyCard } from "./dex-monthly-card";
import { DexNextCard } from "./dex-next-card";
import { DexRuleList } from "./dex-rule-list";
import { DexSection } from "./dex-section";

const RULE_EMPTY = {
  [BADGE_ROLE.gm]: "룰북이 연결된 구인을 운영하면 룰별 뱃지가 생깁니다",
  [BADGE_ROLE.player]: "룰북이 연결된 세션에 참석하면 룰별 뱃지가 생깁니다",
} as const;

interface DexRoleTabProps {
  role: keyof typeof RULE_EMPTY;
  board: DexTab;
}

export function DexRoleTab({ role, board }: DexRoleTabProps) {
  return (
    <>
      <DexSection title={board.total.title} hint={board.total.hint}>
        <DexLadderTrack total={board.total} />
        <DexNextCard
          next={board.total.next}
          note={
            <Text typography="body4" foreground="hint">
              {ATTENDANCE_HINT}
            </Text>
          }
        />
      </DexSection>

      <DexSection title={board.rules.title}>
        <DexRuleList rows={board.rules.rows} emptyText={RULE_EMPTY[role]} />
        {board.rules.rows.length > 0 && (
          <Text typography="body4" foreground="hint">
            {ATTENDANCE_HINT}
          </Text>
        )}
      </DexSection>

      <DexGridSection board={board.variety} />

      <DexSection title={board.reviews.title} hint={board.reviews.hint}>
        <DexLadderTrack total={board.reviews} />
        <DexNextCard next={board.reviews.next} />
      </DexSection>

      <DexSection title={board.monthly.title}>
        <DexMonthlyCard card={board.monthly} />
      </DexSection>
    </>
  );
}
