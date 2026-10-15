import { Text, VStack } from "@roll-and-call/ui";

import type { MyServer } from "@/shared/server";

import { SelectTopMobile } from "./mobile/select-top-mobile";
import { ServerRow } from "./mobile/server-row";

interface ServerSelectMobileViewProps {
  servers: MyServer[];
}

export function ServerSelectMobileView({ servers }: ServerSelectMobileViewProps) {
  return (
    <VStack className="min-h-dvh bg-canvas break-keep">
      <SelectTopMobile />
      <VStack render={<main />}>
        <VStack gap="075" className="px-200 pt-250 pb-150">
          <Text typography="heading2" render={<h1 />}>
            관리할 서버를 골라 주세요
          </Text>
          <Text typography="body3" foreground="muted" className="leading-[1.6] text-pretty">
            내가 소유자이거나 운영진인 서버 {servers.length}개입니다. 서버마다 데이터가 따로
            관리됩니다.
          </Text>
        </VStack>
        <div className="border-t border-gray-200">
          {servers.map((server) => (
            <ServerRow key={server.id} server={server} />
          ))}
        </div>
      </VStack>
    </VStack>
  );
}
