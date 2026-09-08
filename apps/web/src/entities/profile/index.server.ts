// Server-only public API (index.ts와 분리해 postgres 클라이언트가 클라이언트 번들에 안 섞이게).
export { getProfile } from "./api/queries";
