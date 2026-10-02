import { Text } from "@roll-and-call/ui";

import type { MyServer } from "@/shared/server";

interface PendingValueProps {
  server: MyServer;
}

export function PendingValue({ server }: PendingValueProps) {
  if (server.pending === 0) {
    return (
      <Text typography="body3" foreground="hint">
        없음
      </Text>
    );
  }
  const certNote = server.certPending ? `룰북 심사 ${server.certPending}건 포함` : "룰북 심사 없음";
  return (
    <>
      {server.pending}건
      <Text typography="body3" weight="regular" foreground="hint">
        {certNote}
      </Text>
    </>
  );
}
