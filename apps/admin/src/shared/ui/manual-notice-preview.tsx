"use client";

import { Button, Card, Text, VStack, toast } from "@roll-and-call/ui";

interface ManualNoticePreviewProps {
  text: string;
}

// 추방과 차단 해제에서만 쓴다. 당사자가 서버 멤버가 아니라 알림 탭을 볼 수 없어서 운영진이 직접 전한다(D185, D203).
// 본문은 줄바꿈(\n)마다 한 줄로 그린다.
export function ManualNoticePreview({ text }: ManualNoticePreviewProps) {
  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => toast.success("문구를 복사했습니다"));
  };
  return (
    <Card.Root radius={500} padding="sm" render={<VStack gap="100" />}>
      <Text typography="body4" weight="bold" foreground="muted">
        당사자에게 직접 알려 주세요: 아래 문구를 복사해 쓸 수 있습니다
      </Text>
      <Card.Root radius={400} padding="sm" background="subtle" className="relative pr-800">
        <Button variant="ghost" size="sm" onClick={copy} className="absolute top-050 right-050">
          복사
        </Button>
        {text.split("\n").map((line) => (
          <Text key={line} typography="body3" render={<p />}>
            {line}
          </Text>
        ))}
      </Card.Root>
    </Card.Root>
  );
}
