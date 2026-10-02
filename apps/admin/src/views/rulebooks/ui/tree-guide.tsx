import { cn } from "@roll-and-call/ui";

interface TreeGuideProps {
  last: boolean;
}

// 카테고리 아래 책 행의 들여쓰기 선. 글자가 없는 장식이다.
export function TreeGuide({ last }: TreeGuideProps) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-y-0 left-250 w-175">
      <span
        className={cn(
          "absolute top-0 left-0 border-l-[1.5px] border-(--rc-color-border-normal)",
          last ? "h-1/2" : "h-full",
        )}
      />
      <span className="absolute top-1/2 left-0 w-150 border-t-[1.5px] border-(--rc-color-border-normal)" />
    </span>
  );
}
