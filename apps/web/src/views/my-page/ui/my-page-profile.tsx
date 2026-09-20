import { Avatar, Button, HStack, Text } from "@trpg/ui";
import Link from "next/link";

import { AvailabilityRows, KeywordChips, type AvailabilityInterval } from "@/entities/profile";

import { MyPageBlockLabel } from "./my-page-block-label";

// 성향과 가능 시간대는 08 타인 프로필과 같은 문법이라 내 화면과 남의 화면이 같은 것을 같은 모양으로 보여준다.
export function MyPageProfile({
  name,
  avatarUrl,
  bio,
  keywords,
  availability,
}: {
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  keywords: string[];
  availability: AvailabilityInterval[];
}) {
  const bioText = bio || "한 줄 소개를 적어보세요.";
  const bioForeground = bio ? "muted" : "hint";

  return (
    <section className="flex flex-col gap-175">
      <HStack align="center" gap="175">
        <Avatar src={avatarUrl} name={name} size="2xl" />
        <div className="min-w-0 flex-1">
          <Text
            typography="heading3"
            weight="extrabold"
            render={<h1 />}
            className="tracking-[-0.015em]"
          >
            {name}
          </Text>
          <Text truncate typography="body3" foreground={bioForeground} className="mt-050">
            {bioText}
          </Text>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-9 flex-none rounded-400 px-150 text-xs font-bold"
        >
          <Link href="/me/edit">편집</Link>
        </Button>
      </HStack>

      <div>
        <MyPageBlockLabel label="성향" />
        <KeywordChips keywords={keywords} />
      </div>

      <div>
        <MyPageBlockLabel
          label="가능 시간대"
          action={{
            href: "/me/availability",
            label: availability.length > 0 ? "편집" : "추가",
          }}
        />
        <AvailabilityRows intervals={availability} note="조율 격자에 미리 칠해지는 기본값입니다." />
      </div>
    </section>
  );
}
