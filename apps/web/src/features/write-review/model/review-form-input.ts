export type ReviewFormInput = {
  gameId: string;
  // 고치는 중이면 그 후기의 id. 새로 쓰는데 이미 후기가 있으면 다른 기기에서 먼저 쓴 것이다.
  reviewId: string | null;
  body: string;
  spoiler: boolean;
  photoUrls: string[];
};
