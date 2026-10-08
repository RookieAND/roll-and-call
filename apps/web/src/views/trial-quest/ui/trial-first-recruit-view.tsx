import { ruleSetOf } from "@/entities/rulebook";
import { CreateGameForm } from "@/widgets/game-form";

import { buildTrialDefaultGame } from "../model/build-trial-default-game";
import { buildTrialMyRulebooks } from "../model/build-trial-my-rulebooks";
import { TRIAL_RULEBOOK } from "../model/trial-rulebook";
import { TrialFirstRecruit } from "./trial-first-recruit";

// 위저드는 실제 구인 등록 폼을 서버에서 그려 슬롯으로 넘긴다. 등록은 체험 핸들러가 가로챈다.
export function TrialFirstRecruitView() {
  const now = new Date();
  const rulebooks = buildTrialMyRulebooks(now);
  const rule = ruleSetOf({ myRulebooks: rulebooks, rulebookId: TRIAL_RULEBOOK.id })?.label ?? "";
  return (
    <TrialFirstRecruit
      form={
        <CreateGameForm
          serverId="trial-server"
          rulebooks={rulebooks}
          initialRulebookId={TRIAL_RULEBOOK.id}
          defaultGame={buildTrialDefaultGame({ rule, now })}
        />
      }
    />
  );
}
