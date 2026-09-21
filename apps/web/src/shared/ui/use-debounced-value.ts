"use client";

import { useEffect, useState } from "react";

// 값이 delay 동안 바뀌지 않았을 때만 따라간다. 입력마다 요청이 나가지 않게 검색어에 건다.
export function useDebouncedValue<Value>(value: Value, delay: number): Value {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
