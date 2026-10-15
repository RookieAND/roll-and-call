// 서버에서만 부르는 진입점(스냅숏·DB를 읽는다). 클라이언트가 가져오는 index와 나눈다.
export { getReviewDetail } from "./api/get-review-detail";
export { getReviewTitle } from "./api/get-review-title";
export { listReviews, type ReviewList } from "./api/list-reviews";
