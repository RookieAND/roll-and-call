"use client";

import { IconButton } from "@trpg/ui";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// ponytail: 앱 안에서 한 번이라도 이동했는지만 모듈 변수로 기억한다. 새로고침·직접 URL·디스코드 링크로
// 들어오면 false라 폴백 링크로 간다. 탭별로 정확한 스택이 필요해지면 sessionStorage로 옮긴다.
let navigatedInApp = false;

// 루트 레이아웃에 한 번 둔다. 첫 경로에서 바뀌면 "앱 안 히스토리가 있다"로 본다.
export function NavigationTracker() {
  const pathname = usePathname();
  const first = useRef(pathname);
  useEffect(() => {
    if (pathname !== first.current) navigatedInApp = true;
  }, [pathname]);
  return null;
}

export const BACK_BUTTON_CLASS = "-ml-2.5 h-11 w-11 text-gray-600";

// 뒤로는 온 길로. 진입 경로가 없을 때만 fallback(그 흐름의 부모)으로 간다.
export function BackButton({ fallback }: { fallback: string }) {
  const router = useRouter();

  return (
    <IconButton asChild variant="ghost" aria-label="뒤로" className={BACK_BUTTON_CLASS}>
      <Link
        href={fallback}
        onClick={(event) => {
          if (!navigatedInApp) return;
          event.preventDefault();
          router.back();
        }}
      >
        <ChevronLeft size={22} />
      </Link>
    </IconButton>
  );
}
