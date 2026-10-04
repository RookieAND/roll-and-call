import { HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { STAFF_ROLE_LABEL } from "@/shared/lib";
import type { MyServer } from "@/shared/server";
import { FactRows, ServerIcon, Tag } from "@/shared/ui";

import { PendingValue } from "./pending-value";

interface ServerCardProps {
  server: MyServer;
}

export function ServerCard({ server }: ServerCardProps) {
  const botDisconnected = !server.botConnected;
  return (
    <VStack
      gap="175"
      render={<Link href={`/${server.slug}`} />}
      className="rounded-600 border border-gray-200 bg-surface p-200 hover:bg-gray-50"
    >
      <HStack align="center" gap="150">
        <ServerIcon name={server.name} icon={server.icon} size={48} />
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="heading3" truncate>
            {server.name}
          </Text>
          <Text typography="body4" foreground="hint" numeric>
            /{server.slug} · 멤버 {server.members}명
          </Text>
        </VStack>
        <Tag>{STAFF_ROLE_LABEL[server.role]}</Tag>
      </HStack>
      <div className="border-t border-(--rc-color-border-subtle) pt-150">
        <FactRows
          items={[
            { label: "처리 대기", value: <PendingValue server={server} /> },
            {
              label: "서버 상태",
              value: botDisconnected ? (
                <Tag>봇 연결 끊김</Tag>
              ) : (
                <Text typography="body3" foreground="hint">
                  정상
                </Text>
              ),
            },
          ]}
        />
      </div>
      {botDisconnected ? (
        <Text typography="body4" foreground="danger">
          봇이 서버에서 제거되어 디스코드 글을 올리지 못합니다. 데이터는 그대로 남아 있습니다.
        </Text>
      ) : null}
    </VStack>
  );
}
