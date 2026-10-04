import { ONGOING_ROLE } from "@/shared/lib";
import type { MemberOngoingRow, OngoingChoice } from "@/shared/server";
import type { ChoiceRow } from "@/shared/ui";

import { ongoingMeta } from "./ongoing-meta";

type ChoiceAction = OngoingChoice["action"];

const HOSTED_OPTIONS = [
  { value: "keep", label: "구인 진행" },
  { value: "cancel", label: "구인 취소" },
] as const satisfies readonly { value: ChoiceAction; label: string }[];
const PLAYED_OPTIONS = [
  { value: "keep", label: "그대로 진행" },
  { value: "leave", label: "참여 빼기" },
] as const satisfies readonly { value: ChoiceAction; label: string }[];

export function ongoingChoiceRows({
  ongoing,
  changedSessionIds,
}: {
  ongoing: MemberOngoingRow[];
  changedSessionIds: string[];
}): ChoiceRow[] {
  return ongoing.map((activity) => {
    const options = activity.role === ONGOING_ROLE.gm ? HOSTED_OPTIONS : PLAYED_OPTIONS;
    return {
      id: activity.sessionId,
      title: activity.title,
      meta: ongoingMeta(activity),
      options,
      value: changedSessionIds.includes(activity.sessionId) ? options[1].value : options[0].value,
    };
  });
}
