// 서버에서만 부르는 진입점. 클라이언트가 가져오는 index와 나눠야 server-only 모듈이 클라이언트 번들에 섞이지 않는다.
export { writeReviewFromDiscord } from "./api/write-review-from-discord";
