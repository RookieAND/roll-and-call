import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { withQuery } from "@/shared/lib";
import type { MyServer } from "@/shared/server";
import { Panel, UrlSearchInput } from "@/shared/ui";

import { filterServers } from "../model/filter-servers";
import { SERVER_FILTER, type ServerFilter } from "../model/server-filter";
import { PlatformServerTable } from "./platform-server-table";
import { SelectTop } from "./select-top";

interface PlatformServerSelectViewProps {
  nickname: string;
  servers: MyServer[];
  query: { q?: string; filter?: ServerFilter; all?: string };
}

export function PlatformServerSelectView({
  nickname,
  servers,
  query,
}: PlatformServerSelectViewProps) {
  const rows = filterServers({ servers, query: query.q ?? "", filter: query.filter });
  const chips = [
    { key: undefined, label: `전체 ${servers.length}` },
    {
      key: SERVER_FILTER.bot,
      label: `봇 연결 끊김 ${servers.filter((server) => !server.botConnected).length}`,
    },
    {
      key: SERVER_FILTER.pending,
      label: `처리 대기 있음 ${servers.filter((server) => server.pending > 0).length}`,
    },
  ];

  return (
    <VStack className="min-h-dvh bg-canvas">
      <SelectTop nickname={nickname} platformAdmin />
      <VStack align="center" render={<main />} className="flex-1 px-300 py-400">
        <VStack gap="200" className="w-full max-w-[1040px]">
          <HStack align="end" gap="150">
            <VStack gap="075" className="flex-1">
              <Text typography="heading1" render={<h1 />}>
                전체 서버
              </Text>
              <Text typography="body3" foreground="muted">
                플랫폼 관리자로 보는 중입니다. 모든 서버에 소유자 권한으로 들어갑니다.
              </Text>
            </VStack>
          </HStack>
          <HStack align="center" gap="100">
            <UrlSearchInput placeholder="서버 이름이나 slug로 찾기" className="w-[320px]" />
            {chips.map(({ key, label }) => (
              <Chip
                key={label}
                selected={query.filter === key}
                render={<Link href={withQuery("/", query, { filter: key })} scroll={false} />}
              >
                {label}
              </Chip>
            ))}
          </HStack>
          <Panel>
            <PlatformServerTable servers={rows} />
          </Panel>
        </VStack>
      </VStack>
    </VStack>
  );
}
