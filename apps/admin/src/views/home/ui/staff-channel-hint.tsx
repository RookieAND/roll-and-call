import { Text } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface StaffChannelHintProps {
  staffChannel: boolean;
  owner: boolean;
}

// 운영진 채널(servers.staff_channel_id)이 있으면 처리 대기 글이 디스코드에도 올라간다. [Discord]는 소유자에게만 링크다.
export function StaffChannelHint({ staffChannel, owner }: StaffChannelHintProps) {
  if (staffChannel) {
    return (
      <Text typography="body4" foreground="hint">
        새 처리 대기는 운영진 채널에도 올라갑니다.
      </Text>
    );
  }
  const settings = owner ? (
    <Text
      typography="body4"
      foreground="primary"
      render={<ServerLink path="/discord/link" />}
      className="underline"
    >
      [Discord]
    </Text>
  ) : (
    "[Discord]"
  );
  return (
    <Text typography="body4" foreground="hint">
      {settings}에서 운영진 채널을 정하면 디스코드로도 받을 수 있습니다.
    </Text>
  );
}
