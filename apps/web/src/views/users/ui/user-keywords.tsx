import { Badge, cn, HStack } from "@roll-and-call/ui";

const KEYWORD_LIMIT = 3;

interface UserKeywordsProps {
  keywords: readonly string[];
  size?: "sm" | "md";
}

// 프로필의 성향을 닉네임 아래에 작게 보인다. 줄바꿈을 허용하고 한 줄 높이만 보여, 안 들어가는 칩은 반쯤 잘리지 않고 통째로 숨는다.
export function UserKeywords({ keywords, size = "sm" }: UserKeywordsProps) {
  if (keywords.length === 0) return null;
  return (
    <HStack
      wrap
      gap={size === "md" ? "075" : "050"}
      className={cn("min-w-0 overflow-hidden", size === "md" ? "h-7" : "h-5.5")}
    >
      {keywords.slice(0, KEYWORD_LIMIT).map((keyword) => (
        <Badge
          key={keyword}
          colorPalette="primary"
          className={cn(size === "md" ? "px-100 py-050 text-body4" : "px-075 py-050 text-body5")}
        >
          #{keyword}
        </Badge>
      ))}
    </HStack>
  );
}
