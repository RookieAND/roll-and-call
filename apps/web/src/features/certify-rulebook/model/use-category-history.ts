"use client";

import { useEffect, useRef, useState } from "react";

// 룰을 고르면 기록 한 칸을 쌓아, 폰의 뒤로 가기가 신청 화면을 떠나지 않고 룰 목록으로 돌아가게 한다.
export function useCategoryHistory(initialCategoryId: string | null) {
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const pushed = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      pushed.current = false;
      setCategoryId(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openCategory = (id: string) => {
    window.history.pushState(window.history.state, "");
    pushed.current = true;
    setCategoryId(id);
  };

  const closeCategory = () => {
    if (pushed.current) {
      window.history.back();
      return;
    }
    setCategoryId(null);
  };

  return { categoryId, openCategory, closeCategory };
}
