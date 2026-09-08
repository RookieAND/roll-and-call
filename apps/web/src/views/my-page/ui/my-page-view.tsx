import { Avatar, Container, HStack, IconButton, Text, VStack } from "@trpg/ui";
import { ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { bucketHosted, bucketJoined, type SessionCardModel } from "@/entities/game";
import { getGamesByGm, getJoinedGames } from "@/entities/game/index.server";
import { getProfile } from "@/entities/profile/index.server";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { AppBar } from "@/shared/ui/app-bar";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { SessionList } from "@/widgets/session-list";
import { HostedSessionsEmpty, UpcomingSessionsEmpty } from "./session-summary-empty";

const TOP = 3;

export async function MyPageView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const [profile, hosted, joined] = await Promise.all([
    getProfile(user.id),
    getGamesByGm(user.id),
    getJoinedGames(user.id),
  ]);

  const hostedBuckets = bucketHosted(hosted, user.id);
  const joinedBuckets = bucketJoined(joined, user.id);
  const upcoming = joinedBuckets.confirmed; // 참여 예정
  const hosting = hostedBuckets.recruiting; // 운영 중
  const pastCount = joinedBuckets.closed.length + hostedBuckets.closed.length;

  const name =
    profile?.username ??
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email ??
    "";
  const avatar =
    profile?.avatarUrl ?? (user.user_metadata.avatar_url as string | undefined) ?? null;
  const handle =
    (user.user_metadata.user_name as string | undefined) ??
    (user.user_metadata.preferred_username as string | undefined) ??
    null;

  const summary = [
    { n: upcoming.length, label: "참여 예정" },
    { n: hosting.length, label: "운영 중" },
  ];

  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap={6} className="py-6">
          <HStack justify="between" align="center">
            <HStack gap={3} align="center">
              <Avatar src={avatar} name={name} size="2xl" />
              <div>
                <Text typography="heading1" className="block text-[19px] leading-tight">
                  {name}
                </Text>
                {handle && (
                  <Text typography="code2" foreground="hint" render={<span />}>
                    @{handle}
                  </Text>
                )}
              </div>
            </HStack>
            <HStack gap={2} align="center">
              <ThemeToggle />
              <IconButton
                asChild
                variant="outline"
                aria-label="프로필 편집"
                className="h-9 w-9 border-gray-200 text-gray-600"
              >
                <Link href="/me/edit">
                  <Pencil size={16} />
                </Link>
              </IconButton>
            </HStack>
          </HStack>

          <HStack className="gap-[9px]">
            {summary.map((m) => (
              <div key={m.label} className="flex-1 rounded-[14px] border border-gray-200 p-3.5">
                <Text
                  render={<div />}
                  className="text-[24px] font-extrabold leading-none tracking-[-0.03em] tabular-nums"
                >
                  {m.n}
                </Text>
                <Text typography="body4" foreground="muted" className="mt-1.5 block font-semibold">
                  {m.label}
                </Text>
              </div>
            ))}
          </HStack>

          <SummarySection
            title="참여 예정인 세션"
            total={upcoming.length}
            items={upcoming.slice(0, TOP)}
            moreHref="/me/sessions/joined"
            empty={<UpcomingSessionsEmpty />}
          />

          <SummarySection
            title="운영 중인 세션"
            total={hosting.length}
            items={hosting.slice(0, TOP)}
            moreHref="/me/sessions/hosted"
            empty={<HostedSessionsEmpty withImage={upcoming.length > 0} />}
          />

          {pastCount > 0 && (
            <Link
              href="/me/sessions/joined?tab=closed"
              className="flex items-center justify-center gap-1 border-t border-gray-100 pt-4 text-gray-500"
            >
              <Text typography="body3" foreground="muted" className="font-semibold">
                지난 세션 {pastCount}
              </Text>
              <ChevronRight size={15} aria-hidden />
            </Link>
          )}
        </VStack>
      </Container>
    </>
  );
}

function SummarySection({
  title,
  total,
  items,
  moreHref,
  empty,
}: {
  title: string;
  total: number;
  items: SessionCardModel[];
  moreHref: string;
  empty: ReactNode;
}) {
  return (
    <VStack gap={2}>
      <HStack justify="between" align="center">
        <HStack gap={1} align="baseline">
          <Text render={<h2 />} className="text-[13.5px] font-extrabold">
            {title}
          </Text>
          <Text typography="code2" foreground="hint">
            {total}
          </Text>
        </HStack>
        {total > 0 && (
          <Link href={moreHref}>
            <Text
              typography="body4"
              foreground="primary"
              className="inline-flex items-center gap-0.5 font-semibold"
            >
              더 보기 <ChevronRight size={14} aria-hidden />
            </Text>
          </Link>
        )}
      </HStack>
      {total === 0 ? empty : <SessionList items={items} />}
    </VStack>
  );
}
