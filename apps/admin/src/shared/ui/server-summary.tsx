import { HStack, Text, VStack } from "@roll-and-call/ui";

import { ServerIcon } from "./server-icon";
import type { SwitchServer } from "./server-switch";

interface ServerSummaryProps {
  server: SwitchServer;
}

export function ServerSummary({ server }: ServerSummaryProps) {
  return (
    <HStack align="center" gap="100" className="min-w-0 flex-1 text-left">
      <ServerIcon name={server.name} icon={server.icon} size={32} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="subtitle2" truncate className="leading-[1.25]">
          {server.name}
        </Text>
        {server.botConnected ? (
          <Text typography="body4" foreground="hint" className="leading-[1.3]">
            /{server.slug}
          </Text>
        ) : (
          <Text typography="body4" weight="bold" foreground="danger" className="leading-[1.3]">
            봇 연결 끊김
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
