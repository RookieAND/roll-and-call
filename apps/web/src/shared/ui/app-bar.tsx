import { IconButton, Text } from "@trpg/ui";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  back?: string;
  // back과 배타: 핸들러가 있으면 뒤로가기를 링크 대신 버튼으로 렌더(예: 위저드 단계 뒤로).
  onBack?: () => void;
  action?: ReactNode;
};

export function AppBar({ title, back, onBack, action }: Props) {
  const hasBack = back !== undefined || onBack !== undefined;
  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center gap-1 border-b border-gray-200 bg-surface/90 px-3.5 backdrop-blur">
      {onBack ? (
        <IconButton
          variant="ghost"
          aria-label="뒤로"
          className="-ml-1.5 h-9 w-9 text-gray-600"
          onClick={onBack}
        >
          <ChevronLeft size={22} />
        </IconButton>
      ) : (
        back && (
          <IconButton
            asChild
            variant="ghost"
            aria-label="뒤로"
            className="-ml-1.5 h-9 w-9 text-gray-600"
          >
            <Link href={back}>
              <ChevronLeft size={22} />
            </Link>
          </IconButton>
        )
      )}
      <Text
        typography={hasBack ? "heading3" : "heading2"}
        render={<span />}
        className={hasBack ? "truncate tracking-tight" : "tracking-tight"}
      >
        {title}
      </Text>
      <span className="flex-1" />
      {action}
    </header>
  );
}
