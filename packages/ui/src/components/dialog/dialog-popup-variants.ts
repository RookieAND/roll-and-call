import { cva } from "class-variance-authority";

// 모바일에서는 화면 폭에서 좌우 16px씩 물린 값이 상한이다.
export const dialogPopupVariants = cva(
  "fixed top-1/2 left-1/2 z-(--rc-z-dialog) flex max-h-[88dvh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-700 border border-gray-200 bg-surface p-250 shadow-xl outline-none",
  {
    variants: { size: { sm: "max-w-[320px]", md: "max-w-sm", lg: "max-w-[512px]" } },
    defaultVariants: { size: "md" },
  },
);
