import { HStack, IconButton, Text } from "@roll-and-call/ui";
import { ArrowUpRight } from "lucide-react";

interface HomebrewLinkRowProps {
  url: string;
}

export function HomebrewLinkRow({ url }: HomebrewLinkRowProps) {
  return (
    <HStack
      align="center"
      gap="100"
      render={<li />}
      className="h-10 rounded-300 border border-gray-200 bg-(--rc-color-bg-canvas-raised) pr-050 pl-150"
    >
      <Text typography="body3" truncate title={url} className="min-w-0 flex-1">
        {url}
      </Text>
      <IconButton
        variant="outline"
        size="sm"
        aria-label="새 탭에서 열기"
        title="새 탭에서 열기"
        render={<a href={url} target="_blank" rel="noreferrer" />}
      >
        <ArrowUpRight size={16} aria-hidden />
      </IconButton>
    </HStack>
  );
}
