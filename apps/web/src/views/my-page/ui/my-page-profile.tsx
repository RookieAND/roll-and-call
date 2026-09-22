import { Button, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import {
  AvailabilityRows,
  KeywordChips,
  ProfileRow,
  type AvailabilityInterval,
} from "@/entities/profile";

import { MyPageBlockLabel } from "./my-page-block-label";

interface MyPageProfileProps {
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  keywords: string[];
  availability: AvailabilityInterval[];
}

// 성향과 가능 시간대는 08 타인 프로필과 같은 문법이라 내 화면과 남의 화면이 같은 것을 같은 모양으로 보여준다.
export function MyPageProfile({
  name,
  avatarUrl,
  bio,
  keywords,
  availability,
}: MyPageProfileProps) {
  const bioText = bio || "한 줄 소개를 적어보세요.";
  const bioForeground = bio ? "muted" : "hint";

  return (
    <VStack gap="175" render={<section />}>
      <HStack align="center" gap="175">
        <ProfileRow
          size="xl"
          name={name}
          avatarUrl={avatarUrl}
          nameRender={<h1 />}
          subline={bioText}
          sublineForeground={bioForeground}
        />
        <Button
          render={<Link href="/me/edit" />}
          variant="outline"
          className="h-9 flex-none rounded-400 px-150 text-xs font-bold"
        >
          편집
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
    </VStack>
  );
}
