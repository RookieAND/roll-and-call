import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { SignOutButton } from "@/features/auth";
import { ShowBadgesSetting } from "@/features/edit-profile";
import { ServerLink, ThemeSetting } from "@/shared/ui";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

interface MyPageSettingsProps {
  handleLabel: string | null;
  showBadges: boolean;
  questProgress: number;
}

export function MyPageSettings({ handleLabel, showBadges, questProgress }: MyPageSettingsProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        설정
      </Text>
      <div className={MY_PAGE_GROUP_CLASS}>
        <HStack align="center" gap="150" className="min-h-15 border-b border-gray-200 px-175">
          <Text typography="subtitle1" className="min-w-0 flex-1 whitespace-nowrap">
            프로필에 업적 보이기
          </Text>
          <ShowBadgesSetting showBadges={showBadges} />
        </HStack>
        <HStack align="center" gap="150" className="min-h-15 border-b border-gray-200 px-175">
          <Text typography="subtitle1" className="min-w-0 flex-1 whitespace-nowrap">
            화면 테마
          </Text>
          <ThemeSetting className="w-39 flex-none" />
        </HStack>
        <HStack
          align="center"
          gap="150"
          render={<ServerLink path="/onboarding?from=me" />}
          className="min-h-15 border-b border-gray-200 px-175"
        >
          <Text typography="subtitle1" className="min-w-0 flex-1 whitespace-nowrap">
            튜토리얼 퀘스트
          </Text>
          <Text typography="body3" foreground="hint" numeric>
            {questProgress} / 4
          </Text>
          <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
        </HStack>
        <SignOutButton className="min-h-15 w-full justify-between rounded-none border-0 px-175 text-subtitle1 font-bold text-gray-900">
          로그아웃
          {handleLabel && (
            <Text typography="body3" foreground="hint" render={<span />}>
              {handleLabel}
            </Text>
          )}
        </SignOutButton>
      </div>
    </VStack>
  );
}
