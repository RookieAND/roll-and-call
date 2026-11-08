import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { SignOutButton } from "@/features/auth";
import { ServerLink, ThemeSetting } from "@/shared/ui";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

interface MyPageSettingsProps {
  handleLabel: string | null;
  questProgress: number;
}

export function MyPageSettings({ handleLabel, questProgress }: MyPageSettingsProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        설정
      </Text>
      <div className={MY_PAGE_GROUP_CLASS}>
        <HStack align="center" gap="150" className="min-h-15 border-b border-gray-200 px-175">
          <Text typography="subtitle1" className="min-w-0 flex-1 whitespace-nowrap">
            화면 테마
          </Text>
          <ThemeSetting className="w-39 flex-none" />
        </HStack>
        <Button
          render={<ServerLink path="/onboarding?from=me" />}
          variant="ghost"
          colorPalette="gray"
          className="h-auto min-h-15 w-full justify-start gap-150 rounded-none border-b border-gray-200 px-175 text-left"
        >
          <Text typography="subtitle1" className="min-w-0 flex-1 whitespace-nowrap">
            튜토리얼 퀘스트
          </Text>
          <Text typography="body3" foreground="hint" numeric>
            {questProgress} / {ONBOARDING_QUESTS.length}
          </Text>
          <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
        </Button>
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
