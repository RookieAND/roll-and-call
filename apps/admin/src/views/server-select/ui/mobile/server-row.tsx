import { HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { STAFF_ROLE_LABEL } from "@/shared/lib";
import type { MyServer } from "@/shared/server";
import { ServerIcon, Tag } from "@/shared/ui";

interface ServerRowProps {
  server: MyServer;
}

// 서버 한 곳을 한 줄로. 줄 전체가 그 서버 홈으로 가는 입구이고, 봇 연결이 끊긴 서버만 뱃지를 단다.
export function ServerRow({ server }: ServerRowProps) {
  const certNote = server.certPending ? ` · 룰북 심사 ${server.certPending}건` : "";
  return (
    <HStack
      align="center"
      gap="125"
      render={<Link href={`/${server.slug}`} />}
      className="min-h-18 border-b border-(--rc-color-border-subtle) bg-surface py-125 pr-150 pl-200 active:bg-gray-50"
    >
      <ServerIcon name={server.name} icon={server.icon} size={32} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body2" weight="bold" truncate>
          {server.name}
        </Text>
        <Text typography="body4" foreground="hint" truncate numeric>
          {STAFF_ROLE_LABEL[server.role]} · 멤버 {server.members}명{certNote}
        </Text>
      </VStack>
      {server.botConnected ? null : <Tag tone="danger">봇 연결 끊김</Tag>}
    </HStack>
  );
}
