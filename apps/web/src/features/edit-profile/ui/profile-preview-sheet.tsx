"use client";

import { Button, Sheet, Text, VStack } from "@roll-and-call/ui";

import {
  AccentScope,
  KeywordChips,
  normalizeAccentColor,
  normalizePlayStyle,
  PlayStyleBlock,
  ProfileHero,
} from "@/entities/profile";

interface ProfilePreviewSheetProps {
  name: string;
  avatarUrl?: string | null;
  bio: string;
  keywords: string[];
  playStyle: string;
  bannerUrl: string;
  accentColor: string;
}

// 저장하기 전에 다른 사람에게 보일 프로필 위쪽을 입력값 그대로 보여 준다.
export function ProfilePreviewSheet({
  name,
  avatarUrl,
  bio,
  keywords,
  playStyle,
  bannerUrl,
  accentColor,
}: ProfilePreviewSheetProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger render={<Button type="button" variant="ghost" size="sm" />}>
        미리보기
      </Sheet.Trigger>
      <Sheet.Popup className="px-200 pt-100">
        <Sheet.Handle />
        <Sheet.Title className="text-heading3">미리보기</Sheet.Title>
        <AccentScope accentColor={normalizeAccentColor(accentColor) ?? null}>
          <VStack gap="175" className="py-150">
            <ProfileHero
              name={name}
              avatarUrl={avatarUrl}
              bannerUrl={bannerUrl || null}
              accentColor={normalizeAccentColor(accentColor) ?? null}
            />
            <VStack gap="025" className="min-w-0">
              <Text typography="heading2" truncate render={<h2 />}>
                {name}
              </Text>
              {bio && <Text typography="body3">{bio}</Text>}
            </VStack>
            <KeywordChips keywords={keywords} />
            <PlayStyleBlock playStyle={normalizePlayStyle(playStyle)} />
          </VStack>
        </AccentScope>
        <Sheet.Footer>
          <Sheet.Close
            render={<Button variant="outline" colorPalette="gray" className="min-h-12 w-full" />}
          >
            닫기
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
