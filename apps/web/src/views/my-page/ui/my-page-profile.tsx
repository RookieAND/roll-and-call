import { Button, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import {
  AvailabilityRows,
  KeywordChips,
  ProfileRow,
  type AvailabilityInterval,
} from "@/entities/profile";
import { SessionCountStats } from "@/widgets/session-list";

import { MyPageBlockLabel } from "./my-page-block-label";

interface MyPageProfileProps {
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  keywords: string[];
  availability: AvailabilityInterval[];
  hosted: { count: number; href: string };
  played: { count: number; href: string };
}

// 성향과 가능 시간대는 08 타인 프로필과 같은 문법이라 내 화면과 남의 화면이 같은 것을 같은 모양으로 보여준다.
export function MyPageProfile({
  name,
  avatarUrl,
  bio,
  keywords,
  availability,
  hosted,
  played,
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
        <Button render={<Link href="/me/edit" />} variant="outline" size="sm">
          편집
        </Button>
      </HStack>

      <SessionCountStats hosted={hosted} played={played} />

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
        <AvailabilityRows
          intervals={availability}
          note={
            availability.length > 0
              ? "일정 조율 화면을 열면 이 시간대가 미리 칠해져 있습니다."
              : "적어두면 일정 조율 화면에 미리 칠해져 있습니다."
          }
        />
      </div>
    </VStack>
  );
}
