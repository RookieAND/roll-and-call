import { Button, Callout } from "@roll-and-call/ui";
import Link from "next/link";

import type { GamesFilter } from "@/shared/api";
import { serverJoinPath, serverPath } from "@/shared/lib";
import { getCurrentMembership, getCurrentServer } from "@/shared/server";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GamesJoinCalloutProps {
  page: number;
  filter: GamesFilter;
}

// 비멤버(비로그인 포함)는 목록만 본다. 가입하면 지금 보던 목록으로 돌아온다.
export async function GamesJoinCallout({ page, filter }: GamesJoinCalloutProps) {
  const [server, membership] = await Promise.all([getCurrentServer(), getCurrentMembership()]);
  if (membership) return null;
  const next = serverPath({
    slug: server.slug,
    path: gamesHref(filterParams({ ...filter, page })),
  });
  return (
    <Callout.Root colorPalette="primary" className="my-150">
      <Callout.Description className="break-keep">
        {server.name}에 가입하면 구인글을 자세히 보고 신청할 수 있어요.
      </Callout.Description>
      <Callout.Action>
        <Button render={<Link href={serverJoinPath({ slug: server.slug, next })} />} size="sm">
          가입하기
        </Button>
      </Callout.Action>
    </Callout.Root>
  );
}
