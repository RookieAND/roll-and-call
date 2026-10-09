import { Grid, Text, VStack } from "@roll-and-call/ui";

import type { MyServer } from "@/shared/server";

import { SelectTop } from "./select-top";
import { ServerCard } from "./server-card";

interface ServerSelectViewProps {
  nickname: string;
  servers: MyServer[];
}

export function ServerSelectView({ nickname, servers }: ServerSelectViewProps) {
  return (
    <VStack className="min-h-dvh bg-canvas">
      <SelectTop nickname={nickname} />
      <VStack align="center" render={<main />} className="flex-1 px-300 py-500">
        <VStack gap="250" className="w-full max-w-260">
          <VStack gap="075">
            <Text typography="heading1" render={<h1 />}>
              관리할 서버를 골라 주세요
            </Text>
            <Text typography="body3" foreground="muted">
              내가 소유자이거나 운영진인 서버 {servers.length}개입니다. 서버마다 데이터가 따로
              관리됩니다.
            </Text>
          </VStack>
          <Grid cols={3} gap="150">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </Grid>
        </VStack>
      </VStack>
    </VStack>
  );
}
