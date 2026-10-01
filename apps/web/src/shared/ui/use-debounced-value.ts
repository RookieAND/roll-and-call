"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<Value>(value: Value, delay: number): Value {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
