import { type RefObject, useEffect } from "react";

// 문서 높이가 화면 높이와 같아질 때까지 노드를 늘린다. 위아래에 무엇이 붙든 남는 높이를 채운다.
export function useFillViewport({
  ref,
  minHeight,
}: {
  ref: RefObject<HTMLElement | null>;
  minHeight: number;
}) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function fit() {
      if (!node || node.offsetParent === null) return;
      node.style.height = `${minHeight}px`;
      const spare = window.innerHeight - document.documentElement.scrollHeight;
      node.style.height = `${Math.max(minHeight, minHeight + spare)}px`;
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(document.body);
    observer.observe(node);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref, minHeight]);
}
