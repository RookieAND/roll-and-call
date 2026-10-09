import { Callout } from "@roll-and-call/ui";

import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

interface RecruitMethodNoteProps {
  method: RecruitMethod;
}

export function RecruitMethodNote({ method }: RecruitMethodNoteProps) {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Description>{NOTE_LINES[method]}</Callout.Description>
    </Callout.Root>
  );
}

const NOTE_LINES = {
  [RECRUIT_METHOD.firstCome]: <>신청한 순서대로 정원까지 바로 확정됩니다.</>,
  [RECRUIT_METHOD.lottery]: (
    <>
      정원과 관계없이 신청을 받고, 마감 때 추첨합니다.
      <br />
      뽑히지 않은 신청자는 대기 명단에 순서대로 남습니다.
    </>
  ),
  [RECRUIT_METHOD.selection]: (
    <>
      마감 뒤 GM이 직접 고릅니다.
      <br />
      고르지 않은 신청자는 신청 순서대로 대기합니다.
    </>
  ),
} as const satisfies Record<RecruitMethod, React.ReactNode>;
