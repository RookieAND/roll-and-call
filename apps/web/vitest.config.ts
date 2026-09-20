import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // 모델 배럴이 tsx를 같이 내보내므로 변환이 필요하다. tsconfig의 jsx는 Next가 쓰는 "preserve"다.
  plugins: [react()],
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
