"use client";

import { HStack, Text } from "@roll-and-call/ui";

import { useCurrentServer } from "./current-server-context";
import { ServerIcon } from "./server-icon";

// 확인 모달의 제목 위에 두어 어느 서버에서 하는 조치인지 보여 준다. Dialog.Header 맨 앞에 넣는다.
export function ModalServerLabel() {
  const server = useCurrentServer();
  return (
    <HStack align="center" gap="075">
      <ServerIcon name={server.name} icon={server.icon} size={20} />
      <Text typography="body4" weight="bold" foreground="muted">
        {server.name} 서버
      </Text>
    </HStack>
  );
}
