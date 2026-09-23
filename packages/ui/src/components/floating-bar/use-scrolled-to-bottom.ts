import { useEffect, useState } from "react";

// ponytail: window 스크롤만 본다. 내부 스크롤 컨테이너 안에 바를 두면 그 요소를 받도록 넓힌다.
export function useScrolledToBottom(enabled: boolean): boolean {
  const [atBottom, setAtBottom] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const update = () =>
      setAtBottom(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);
  return atBottom;
}
