import { Callout, Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { withQuery } from "@/shared/lib";
import type { MyServer } from "@/shared/server";
import { EMPTY_IMAGE, EmptyState, UrlSearchInput } from "@/shared/ui";

import { filterServers } from "../model/filter-servers";
import type { ServerFilter } from "../model/server-filter";
import { serverFilterChips } from "../model/server-filter-chips";
import { SelectTopMobile } from "./mobile/select-top-mobile";
import { ServerRow } from "./mobile/server-row";

interface PlatformServerSelectMobileViewProps {
  servers: MyServer[];
  query: { q?: string; filter?: ServerFilter; all?: string };
}

export function PlatformServerSelectMobileView({
  servers,
  query,
}: PlatformServerSelectMobileViewProps) {
  const rows = filterServers({ servers, query: query.q ?? "", filter: query.filter });
  return (
    <VStack className="min-h-dvh bg-canvas break-keep">
      <SelectTopMobile />
      <VStack render={<main />}>
        <Text typography="heading2" render={<h1 />} className="px-200 pt-250 pb-150">
          전체 서버
        </Text>
        <VStack gap="100" className="px-200 pb-150">
          <Callout.Root>
            <Callout.Icon />
            <Callout.Title>플랫폼 관리자로 보는 중입니다</Callout.Title>
            <Callout.Description>모든 서버에 소유자 권한으로 들어갑니다.</Callout.Description>
          </Callout.Root>
          <UrlSearchInput placeholder="서버 이름이나 slug로 찾기" className="w-full" />
          <HStack gap="075" className="-mx-200 overflow-x-auto px-200">
            {serverFilterChips(servers).map(({ key, label }) => (
              <Chip
                key={label}
                selected={query.filter === key}
                render={<Link href={withQuery("/", query, { filter: key })} scroll={false} />}
                className="shrink-0"
              >
                {label}
              </Chip>
            ))}
          </HStack>
        </VStack>
        <div className="border-t border-gray-200">
          {rows.length === 0 ? (
            <EmptyState image={EMPTY_IMAGE.search} title="조건에 맞는 서버가 없어요" />
          ) : null}
          {rows.map((server) => (
            <ServerRow key={server.id} server={server} />
          ))}
        </div>
      </VStack>
    </VStack>
  );
}
