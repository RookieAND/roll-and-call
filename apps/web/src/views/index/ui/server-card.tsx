import { STAFF_ROLE_LABEL } from "@roll-and-call/database/moderation/model";
import { Badge, Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { formatDateTime, serverPath } from "@/shared/lib";
import { loadServerSummary } from "@/widgets/session-list";

import type { MemberServer } from "../model/member-server";
import { ServerIcon } from "./server-icon";
import { ServerStat } from "./server-stat";

interface ServerCardProps {
  server: MemberServer;
  userId: string;
}

export async function ServerCard({ server, userId }: ServerCardProps) {
  const { todoCount, nextSessionAt } = await loadServerSummary({ serverId: server.id, userId });
  const href = serverPath({ slug: server.slug, path: "/" });
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL;
  const showAdmin = !isNull(server.staffRole) && Boolean(adminUrl);
  const todoText = todoCount > 0 ? `${todoCount}건` : "없음";
  const todoEmphasis = todoCount > 0 ? "primary" : "hint";
  const nextText = isNull(nextSessionAt) ? "예정 없음" : formatDateTime(nextSessionAt);
  const nextEmphasis = isNull(nextSessionAt) ? "hint" : "normal";

  return (
    <VStack className="h-full overflow-hidden rounded-600 border border-gray-200 bg-surface">
      <HStack
        align="center"
        gap="150"
        render={<Link href={href} aria-label={`${server.name} 열기`} />}
        className="min-h-[76px] py-175 pr-150 pl-175 transition-colors hover:bg-gray-50"
      >
        <ServerIcon name={server.name} icon={server.icon} />
        <VStack gap="050" className="min-w-0 flex-1">
          <HStack align="center" gap="075" wrap>
            <Text typography="subtitle1" weight="bold" truncate>
              {server.name}
            </Text>
            {server.staffRole && (
              <Badge colorPalette="primary">{STAFF_ROLE_LABEL[server.staffRole]}</Badge>
            )}
          </HStack>
          <Text typography="code2" foreground="hint">
            {href}
          </Text>
        </VStack>
        <ChevronRight size={18} aria-hidden className="flex-none text-hint" />
      </HStack>
      <div className="grid grid-cols-2 border-t border-gray-200">
        <ServerStat label="할 일" value={todoText} emphasis={todoEmphasis} />
        <ServerStat
          label="다음 내 세션"
          value={nextText}
          emphasis={nextEmphasis}
          className="border-l border-gray-200"
        />
      </div>
      {showAdmin && (
        <div className="mt-auto border-t border-gray-200 px-150 pt-125 pb-150">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            render={<a href={adminUrl} target="_blank" rel="noreferrer" />}
          >
            <ShieldCheck size={16} aria-hidden />
            어드민
          </Button>
        </div>
      )}
    </VStack>
  );
}
