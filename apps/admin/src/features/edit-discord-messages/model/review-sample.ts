// 후기 양식 미리보기에 끼우는 예시 값. 멘션은 미리보기가 @ 글자를 멘션 모양으로 그린다.
export const REVIEW_SAMPLE_BODY =
  "장면이 많았는데도 시간이 훌쩍 지나갔어요.\nGM님 덕분에 끝까지 몰입해서 즐겼습니다.";

export function reviewSampleValues({ gmReview }: { gmReview: boolean }) {
  return {
    "구인 제목": "달그림자 여관",
    룰: "크툴루의 부름",
    GM: "새벽세시",
    작성자: "탐정놀이중",
    "후기 종류": gmReview ? "GM 후기" : "PL 후기",
    "GM 후기 표시": gmReview ? "[GM 후기]" : undefined,
    "스포 표시": undefined,
    "작성자 멘션": "@탐정놀이중",
    "GM 멘션": "@새벽세시",
    "참여자 멘션": "@탐정놀이중 @달빛토끼 @김코코",
    "롤앤콜 링크": "롤앤콜에서 보기",
  };
}
