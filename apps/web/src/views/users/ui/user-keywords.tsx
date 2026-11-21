import { Badge, HStack } from "@roll-and-call/ui";

const KEYWORD_LIMIT = 3;

interface UserKeywordsProps {
  keywords: readonly string[];
}

// 프로필의 성향을 닉네임 아래에 작게 보인다. 한 줄에 들어가도록 앞의 몇 개만 둔다.
export function UserKeywords({ keywords }: UserKeywordsProps) {
  if (keywords.length === 0) return null;
  return (
    <HStack gap="050" className="min-w-0 overflow-hidden">
      {keywords.slice(0, KEYWORD_LIMIT).map((keyword) => (
        <Badge key={keyword} colorPalette="primary" className="px-075 py-050 text-body5">
          #{keyword}
        </Badge>
      ))}
    </HStack>
  );
}
