import { filledLinks } from "./filled-links";

// 1단계는 이름·소개·설명을 채우면 넘어간다.
export function canProceedHomebrew({
  name,
  summary,
  description,
}: {
  name: string;
  summary: string;
  description: string;
}) {
  return name.trim() !== "" && summary.trim() !== "" && description.trim() !== "";
}

// 거기에 링크나 이미지를 하나 이상 넣어야 신청할 수 있다. 올리는 중인 이미지는 세지 않는다.
export function canSubmitHomebrew({
  name,
  summary,
  description,
  links,
  imageCount,
}: {
  name: string;
  summary: string;
  description: string;
  links: string[];
  imageCount: number;
}) {
  return (
    canProceedHomebrew({ name, summary, description }) && filledLinks(links).length + imageCount > 0
  );
}
