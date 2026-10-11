import { renderReviewTemplate } from "@roll-and-call/database/servers/model";
import Image from "next/image";

import { DISCORD } from "@/shared/lib";

import { REVIEW_SAMPLE_BODY, reviewSampleValues } from "../model/review-sample";
import { Mention } from "./discord-mention";

interface ReviewTemplatePreviewProps {
  title: string;
  body: string;
  gmReview: boolean;
}

function lineNodes(line: string) {
  return line
    .split(/(@[^\s·]+)/)
    .filter((part) => part !== "")
    .map((part, index) =>
      part.startsWith("@") ? (
        <Mention key={index}>{part}</Mention>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
}

// 포럼 게시글처럼 제목 아래에 본문이 놓인 모양으로 보여 준다. 변수는 예시 값으로 바꾼다.
export function ReviewTemplatePreview({ title, body, gmReview }: ReviewTemplatePreviewProps) {
  const values = reviewSampleValues({ gmReview });
  const renderedTitle = renderReviewTemplate({ template: title, values, reviewBody: "" });
  const renderedBody = renderReviewTemplate({
    template: body,
    values,
    reviewBody: REVIEW_SAMPLE_BODY,
  });
  return (
    <div
      className="flex gap-150 rounded-400 px-200 py-150"
      style={{ background: DISCORD.background, color: DISCORD.text }}
    >
      <Image
        src="/discord-bot.png"
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full"
      />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-white wrap-anywhere">{renderedTitle}</div>
        <div className="mt-050 flex flex-col leading-[22px] wrap-anywhere">
          {renderedBody.split("\n").map((line, index) =>
            line.startsWith("-# ") ? (
              <div key={index} className="text-body4" style={{ color: DISCORD.muted }}>
                {lineNodes(line.slice(3))}
              </div>
            ) : (
              <div key={index} className="min-h-[22px]">
                {lineNodes(line)}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
