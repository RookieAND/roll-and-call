import type { ReactNode } from "react";

import { buildTrialMyGame } from "../model/build-trial-my-game";
import type { TrialKind } from "../model/trial-kind";
import { TRIAL_RECRUIT_SCREEN, type TrialRecruitScreenName } from "../model/trial-recruit-screen";
import type { TrialRecruit } from "../model/trial-store";
import { TrialJobList } from "./trial-job-list";
import { TrialManage } from "./trial-manage";
import { TrialMyGameDetail } from "./trial-my-game-detail";
import { TrialRecruitResult } from "./trial-recruit-result";

interface TrialRecruitScreenProps {
  screen: TrialRecruitScreenName;
  form: ReactNode;
  recruit: TrialRecruit | null;
  applied: Partial<Record<TrialKind, true>>;
  now: Date;
  onOpen: (screen: TrialRecruitScreenName) => void;
  onLeave: () => void;
}

export function TrialRecruitScreen({
  screen,
  form,
  recruit,
  applied,
  now,
  onOpen,
}: TrialRecruitScreenProps) {
  if (!recruit || screen === TRIAL_RECRUIT_SCREEN.wizard) return form;
  if (screen === TRIAL_RECRUIT_SCREEN.result) {
    return (
      <TrialRecruitResult
        recruit={recruit}
        onBack={() => onOpen(TRIAL_RECRUIT_SCREEN.wizard)}
        onOpenList={() => onOpen(TRIAL_RECRUIT_SCREEN.list)}
      />
    );
  }
  if (screen === TRIAL_RECRUIT_SCREEN.list) {
    return <TrialJobList applied={applied} now={now} mine={buildTrialMyGame({ recruit, now })} />;
  }
  if (screen === TRIAL_RECRUIT_SCREEN.mine)
    return <TrialMyGameDetail recruit={recruit} now={now} />;
  return <TrialManage recruit={recruit} onBack={() => onOpen(TRIAL_RECRUIT_SCREEN.mine)} />;
}
