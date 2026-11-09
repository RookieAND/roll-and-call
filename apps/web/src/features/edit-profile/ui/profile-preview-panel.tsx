import { Avatar, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { BannerImage } from "@/shared/ui";

interface ProfilePreviewPanelProps {
  name: string;
  avatarUrl?: string | null;
  bio: string;
  bannerUrl: string;
}

// 데스크톱에서 편집 폼 오른쪽에 늘 붙어 있는 미리보기. 모바일은 앱바 [미리보기] 시트를 쓴다.
export function ProfilePreviewPanel({ name, avatarUrl, bio, bannerUrl }: ProfilePreviewPanelProps) {
  return (
    <Card.Root
      padding="none"
      radius={600}
      className="flex flex-col gap-150 border-dashed border-gray-300 p-200"
    >
      <Text typography="subtitle2" render={<h2 />}>
        미리보기
      </Text>
      <div className="relative aspect-[3/1] overflow-hidden rounded-400 bg-primary-100">
        {bannerUrl && <BannerImage src={bannerUrl} />}
      </div>
      <HStack align="center" gap="125">
        <Avatar src={avatarUrl} name={name} size="xl" />
        <VStack gap="050" className="min-w-0">
          <Text typography="subtitle1" weight="extrabold" truncate>
            {name}
          </Text>
          {bio && (
            <Text typography="body4" foreground="muted">
              {bio}
            </Text>
          )}
        </VStack>
      </HStack>
    </Card.Root>
  );
}
