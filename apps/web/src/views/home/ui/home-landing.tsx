import { Container, HStack, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { GameRow } from "@/entities/game";
import { LoginButton } from "@/features/auth";
import { getRecruitingGamesPage } from "@/shared/server";

const PREVIEW_COUNT = 2;

const PITCH = [
  { n: 1, t: "구인 등록", d: "GM이 룰, 시놉시스, 인원, 모집 마감을 한 번에 올립니다." },
  {
    n: 2,
    t: "일정 조율",
    d: "참여자가 30분 단위로 가능 시간을 칠하면 겹치는 슬롯이 후보로 올라옵니다.",
  },
  { n: 3, t: "세션 확정", d: "GM이 고른 시간이 모두의 게임 카드에 확정으로 표시됩니다." },
];

// 비로그인 랜딩: 히어로 → 동작 방식 → 모집 중 맛보기.
export async function HomeLanding() {
  const { rows: recruitingGames } = await getRecruitingGamesPage(1, {}, PREVIEW_COUNT);

  return (
    <Container size="sm" className="px-0">
      <VStack gap={8} className="pb-10">
        <div className="bg-[linear-gradient(180deg,#F7F7FE,#FFFFFF)] px-6 pt-11 pb-[34px]">
          <VStack gap={4}>
            <HStack gap={2} align="center">
              <span className="h-[26px] w-[26px] rounded-lg bg-primary-600" />
              <Text typography="heading3">롤앤콜</Text>
            </HStack>
            <Text
              typography="display1"
              render={<h1 />}
              className="leading-snug tracking-[-0.035em]"
            >
              TRPG 세션, 모집부터
              <br />
              일정 확정까지 한 곳에서
            </Text>
            <Text foreground="muted" className="leading-relaxed">
              구인 글을 올려 플레이어를 모으고, 서로 가능한 시간을 겹쳐 세션 일시를 정합니다.
            </Text>
            <LoginButton className="w-full" />
            <Text typography="body4" foreground="muted" className="text-center leading-relaxed">
              별도 가입 없이 디스코드 계정으로 시작합니다.
              <br />
              닉네임과 아바타만 가져옵니다.
            </Text>
          </VStack>
        </div>

        <VStack gap={4} className="px-6">
          <Text typography="subtitle2" foreground="muted">
            HOW IT WORKS
          </Text>
          <VStack gap={0}>
            {PITCH.map((p, i) => (
              <HStack key={p.n} gap={3} align="stretch">
                <div className="flex flex-col items-center">
                  <Text
                    typography="subtitle2"
                    foreground="primary"
                    className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary-50"
                  >
                    {p.n}
                  </Text>
                  {i < PITCH.length - 1 && <span className="mt-1 w-px flex-1 bg-[#EAEAF0]" />}
                </div>
                <div className="pb-5">
                  <Text typography="subtitle1">{p.t}</Text>
                  <Text typography="body2" foreground="muted" className="mt-0.5 block">
                    {p.d}
                  </Text>
                </div>
              </HStack>
            ))}
          </VStack>
        </VStack>

        <VStack gap={3} className="border-t border-gray-100 px-6 pt-6">
          <HStack justify="between" align="center">
            <Text typography="subtitle1">지금 모집 중</Text>
            <Link href="/games">
              <Text
                typography="body2"
                foreground="primary"
                className="inline-flex items-center gap-0.5"
              >
                전체 보기 <ChevronRight size={14} aria-hidden />
              </Text>
            </Link>
          </HStack>
          {recruitingGames.map((g) => (
            <Link key={g.id} href={`/games/${g.id}`} className="block">
              <GameRow game={g} />
            </Link>
          ))}
          <Text typography="body4" foreground="muted" className="text-center">
            둘러보기는 로그인 없이, 참여는 로그인 후에.
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
}
