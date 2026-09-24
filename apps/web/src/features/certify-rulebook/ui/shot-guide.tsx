import { HStack, Text, VStack } from "@roll-and-call/ui";

import { CERT_SHOT_GUIDE, CERT_SHOT_LABEL, type CertShot } from "@/entities/rulebook";
import { LineBreaks } from "@/shared/ui";

interface ShotGuideProps {
  shot: CertShot;
  nickname: string;
}

// 누른 사진 칸의 안내. 앞면이면 쪽지에 적을 닉네임을 같이 보여 준다.
export function ShotGuide({ shot, nickname }: ShotGuideProps) {
  const guide = CERT_SHOT_GUIDE[shot];
  return (
    <VStack gap="075" className="rounded-500 bg-gray-50 px-175 py-150">
      <Text typography="body3" weight="extrabold">
        {CERT_SHOT_LABEL[shot]}
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="[text-wrap:pretty]">
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
