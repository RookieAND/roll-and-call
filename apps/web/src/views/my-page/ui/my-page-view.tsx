import { Button, Container, Text, VStack } from "@trpg/ui";
import Link from "next/link";
import { LoginRequired, SignOutButton } from "@/features/auth";
import { profileDisplay } from "@/entities/profile";
import { ChevronRight } from "lucide-react";
import { getCurrentUser, getProfile, isDiscordConfigured } from "@/shared/server";
import { loadMySessions } from "@/widgets/session-list";
import { AppBar, EmptyState, ThemeSetting } from "@/shared/ui";
import { summarizeMySessions } from "../model/my-page-summary";
import { MyPageHeader } from "./my-page-header";
import { MySessionRow } from "./my-session-row";

const GROUP = "overflow-hidden rounded-[14px] border border-gray-200";

export async function MyPageView() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar title="마이페이지" />
        <Container size="sm">
          <div className="py-6">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const [profile, mySessions] = await Promise.all([getProfile(user.id), loadMySessions(user.id)]);

  const { name, avatar, handle } = profileDisplay({ profile, user });
  const sessions = summarizeMySessions(mySessions);
  const handleLabel = handle ? `@${handle}` : null;
  const discordConfigured = isDiscordConfigured();

  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap={5} className="py-[18px]">
          <MyPageHeader name={name} avatarUrl={avatar} bio={profile?.bio ?? null} />

          <section className="flex flex-col gap-2.5">
            <div className="flex items-center">
              <Text typography="heading3" render={<h2 />} className="flex-1">
                내 세션
              </Text>
              {!sessions.isEmpty && (
                <Link href={sessions.joined.href}>
                  <Text
                    typography="body4"
                    foreground="primary"
                    className="inline-flex items-center gap-0.5 text-[12.5px] font-semibold"
                  >
                    전체 보기 <span aria-hidden>›</span>
                  </Text>
                </Link>
              )}
            </div>

            {sessions.isEmpty ? (
              <EmptyState
                image="/empty-states/empty-my-games.png"
                size="section"
                title="아직 세션이 없습니다"
                description="구인에 참여하거나 직접 열어보세요."
                action={
                  <div className="flex w-full gap-2">
                    <Button asChild variant="outline" className="h-11 flex-1">
                      <Link href="/games">구인 목록</Link>
                    </Button>
                    <Button asChild className="h-11 flex-1">
                      <Link href="/games/new">새 구인</Link>
                    </Button>
                  </div>
                }
              />
            ) : (
              <div className={GROUP}>
                <MySessionRow
                  label="참여 중"
                  count={sessions.joined.count}
                  detail={sessions.joined.detail}
                  href={sessions.joined.href}
                />
                <MySessionRow
                  label="내가 운영"
                  count={sessions.hosting.count}
                  detail={sessions.hosting.detail}
                  urgent={sessions.hosting.urgent}
                  href={sessions.hosting.href}
                />
                <MySessionRow
                  label="끝난 세션"
                  count={sessions.past.count}
                  detail="기록으로 남습니다"
                  href={sessions.past.href}
                />
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2.5">
            <Text typography="heading3" render={<h2 />}>
              설정
            </Text>
            <div className={GROUP}>
              <div className="flex items-center gap-3 border-b border-gray-100 p-[13px]">
                <Text typography="subtitle1" className="flex-1">
                  화면 테마
                </Text>
                <ThemeSetting />
              </div>
              <Link
                href="/me/discord"
                className="flex min-h-[52px] items-center gap-3 border-b border-gray-100 px-[13px] transition-colors hover:bg-gray-50"
              >
                <Text typography="subtitle1" className="flex-1">
                  디스코드 연동
                </Text>
                {!discordConfigured && (
                  <span aria-label="연동 안 됨" className="size-2 rounded-full bg-danger-solid" />
                )}
                <ChevronRight size={17} className="text-gray-400" aria-hidden />
              </Link>
              <SignOutButton className="h-[52px] w-full justify-between rounded-none border-0 px-[13px] text-[14px] font-bold text-gray-900">
                로그아웃
                {handleLabel && (
                  <Text typography="body3" foreground="hint" render={<span />}>
                    {handleLabel}
                  </Text>
                )}
              </SignOutButton>
            </div>
          </section>
        </VStack>
      </Container>
    </>
  );
}
