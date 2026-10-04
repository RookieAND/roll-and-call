import { Callout } from "@roll-and-call/ui";

import { unavailableSubject } from "../model/unavailable-subject";

interface UnavailableWarningProps {
  names: string[];
}

export function UnavailableWarning({ names }: UnavailableWarningProps) {
  return (
    <Callout.Root colorPalette="warning" size="sm">
      <Callout.Icon />
      <Callout.Description>
        {unavailableSubject(names)} 이 시간에 불가입니다.
        <br />
        확정 전에 이 날 진행이 가능한지 물어보세요.
      </Callout.Description>
    </Callout.Root>
  );
}
