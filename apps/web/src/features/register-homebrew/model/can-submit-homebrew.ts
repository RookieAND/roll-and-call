import { filledLinks } from "./filled-links";

// 이름·소개를 채우고 링크나 이미지를 하나 이상 넣어야 신청할 수 있다. 올리는 중인 이미지는 세지 않는다.
export function canSubmitHomebrew({
  name,
  summary,
  links,
  imageCount,
}: {
  name: string;
  summary: string;
  links: string[];
  imageCount: number;
}) {
  return name.trim() !== "" && summary.trim() !== "" && filledLinks(links).length + imageCount > 0;
}
