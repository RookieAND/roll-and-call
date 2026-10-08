import { type RefObject, useEffect } from "react";

// 문서 높이는 화면보다 짧아질 수 없어서(앱 틀의 min-h-dvh) 그대로 재면 남는 높이가 늘 0이다.
// 조상의 min-height를 잠깐 걷어 내용만의 높이를 재고, 모자란 만큼 노드를 늘린다.
function contentHeight(node: HTMLElement) {
  const stretched: [HTMLElement, string][] = [];
  for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (parseFloat(getComputedStyle(ancestor).minHeight) > 0) {
      stretched.push([ancestor, ancestor.style.minHeight]);
      ancestor.style.minHeight = "0px";
    }
  }
  const height = document.body.offsetHeight;
  for (const [ancestor, minHeight] of stretched) ancestor.style.minHeight = minHeight;
  return height;
}

// 위아래에 무엇이 붙든 화면에서 남는 높이를 채운다.
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
      const spare = window.innerHeight - contentHeight(node);
      node.style.height = `${Math.max(minHeight, minHeight + spare)}px`;
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(document.body);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref, minHeight]);
}
