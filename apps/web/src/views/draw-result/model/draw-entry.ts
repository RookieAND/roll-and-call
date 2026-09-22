export type DrawEntry = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  // 직접 확정해 추첨에 들어가지 않은 사람은 값이 없다.
  roll: number | null;
};
