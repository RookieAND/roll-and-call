import { formatMonthDay } from "@/shared/lib";

type Notice = { palette: "primary" | "warning"; title: string; description: string };

export function reviewFormNotice(review: { hidden: boolean } | null, editUntil: Date): Notice {
  if (!review) {
    return {
      palette: "primary",
      title: "이 세션의 공개 후기를 작성합니다",
      description: `등록 후 ${formatMonthDay(editUntil)}까지 수정할 수 있습니다.`,
    };
  }
  if (review.hidden) {
    return {
      palette: "warning",
      title: "운영진이 숨긴 후기입니다",
      description: "고친 뒤 디스코드로 해제를 요청해 주세요.",
    };
  }
  return {
    palette: "primary",
    title: "공개된 후기를 고칩니다",
    description: `${formatMonthDay(editUntil)}까지 고칠 수 있습니다.`,
  };
}
