import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // tsconfig의 jsx: preserve(Next 몫)와 달리 렌더 테스트는 JSX를 바로 바꿔야 한다.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
