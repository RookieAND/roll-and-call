import { HStack, IconButton, Text } from "@roll-and-call/ui";
import { ArrowUpRight } from "lucide-react";

interface MaterialLinkRowProps {
  url: string;
}

// 링크 내용은 앱이 확인하지 않으므로 운영진이 새 탭에서 열어 본다.
export function MaterialLinkRow({ url }: MaterialLinkRowProps) {
  return (
    <HStack
      align="center"
      gap="100"
      className="h-10 rounded-400 border border-gray-200 bg-canvas pr-050 pl-150"
    >
      <Text typography="body3" truncate title={url} className="min-w-0 flex-1">
        {url}
      </Text>
      <IconButton
        variant="outline"
        size="sm"
        aria-label="새 탭에서 열기"
        title="새 탭에서 열기"
        render={<a href={url} target="_blank" rel="noopener noreferrer" />}
      >
        <ArrowUpRight size={16} aria-hidden />
      </IconButton>
    </HStack>
  );
}
