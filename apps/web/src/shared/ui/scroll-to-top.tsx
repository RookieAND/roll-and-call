"use client";

import { useEffect } from "react";

// 앱 틀이 display: contents라 Next의 기본 스크롤 복귀가 건너뛰는 화면에서, 들어올 때 맨 위로 올린다.
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return null;
}
