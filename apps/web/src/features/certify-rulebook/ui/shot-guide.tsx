import { HStack, Text, VStack } from "@roll-and-call/ui";

import { certShotGuide, type CertShot } from "@/entities/rulebook";
import { LineBreaks } from "@/shared/ui";

interface ShotGuideProps {
  shot: CertShot;
  bookCount: number;
  nickname: string;
}

// 누른 사진 칸의 안내. 앞면이면 쪽지에 적을 닉네임을 같이 보여 준다.
export function ShotGuide({ shot, bookCount, nickname }: ShotGuideProps) {
  const guide = certShotGuide(shot, bookCount);
  return (
    <VStack gap="075" className="rounded-500 bg-gray-50 px-175 py-150">
      <Text typography="body3" weight="extrabold">
        {guide.title}
      </Text>
      <Text
        typography="body3"
        foreground="muted"
        render={<p />}
        className="break-keep [text-wrap:pretty]"
      >
        <LineBreaks lines={guide.lines} />
      </Text>
      {guide.nickname && (
        <HStack align="center" gap="100" className="mt-025">
          <Text typography="body4" foreground="muted">
            쪽지에 적을 닉네임
          </Text>
          <Text
            typography="body4"
            weight="bold"
            className="rounded-200 border border-gray-200 bg-surface px-100 py-025 font-mono"
          >
            {nickname}
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
