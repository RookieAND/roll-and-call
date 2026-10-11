interface ThumbnailValues {
  thumbnailUrl?: string | null;
  thumbnailSpoiler: boolean;
}

interface HasThumbnailChangedInput {
  before: ThumbnailValues;
  after: ThumbnailValues;
}

// 폼은 썸네일이 없으면 빈 문자열을, DB는 null을 갖는다. 둘을 같은 「없음」으로 맞춰야 안 건드린 수정이 바뀐 것으로 보이지 않는다.
// 썸네일이 없으면 스포일러 값은 의미가 없으므로 toGameColumns처럼 꺼진 것으로 본다.
export function hasThumbnailChanged({ before, after }: HasThumbnailChangedInput) {
  const beforeUrl = before.thumbnailUrl || null;
  const afterUrl = after.thumbnailUrl || null;
  const beforeSpoiler = Boolean(beforeUrl) && before.thumbnailSpoiler;
  const afterSpoiler = Boolean(afterUrl) && after.thumbnailSpoiler;
  return beforeUrl !== afterUrl || beforeSpoiler !== afterSpoiler;
}
