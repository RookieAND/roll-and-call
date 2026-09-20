import { Text } from "@trpg/ui";

import { LoginButton } from "@/features/auth";
import { StatusNotice } from "@/shared/ui";

interface ParticipantsOnlyNoticeProps {
  isSignedIn: boolean;
}

export function ParticipantsOnlyNotice({ isSignedIn }: ParticipantsOnlyNoticeProps) {
  return (
    <StatusNotice tone="muted">
      <Text typography="subtitle2" render={<p />}>
        참여자만 가능 시간을 입력할 수 있습니다
      </Text>
      <Text typography="body4" foreground="muted" render={<p />} className="mt-025">
        겹침은 누구나 볼 수 있습니다.
      </Text>
      {!isSignedIn && <LoginButton className="mt-150 h-11 w-full" />}
    </StatusNotice>
  );
}
