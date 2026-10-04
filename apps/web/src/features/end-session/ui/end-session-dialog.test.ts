import { createElement, Fragment, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// 확인 창 본체는 포털이라 서버 렌더에 나오지 않는다. 넘긴 값이 보이도록 펼쳐서 그린다.
vi.mock("@/shared/ui", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/ui")>()),
  ConfirmDialog: (props: {
    title: string;
    description: ReactNode;
    confirmLabel: string;
    confirmColorPalette: string;
    pending: boolean;
    children: ReactNode;
  }) =>
    createElement(
      Fragment,
      null,
      `[title:${props.title}]`,
      props.description,
      props.children,
      `[confirm:${props.confirmLabel}|solid|${props.confirmColorPalette}|loading:${props.pending}]`,
    ),
}));

const { EndSessionDialogView } = await import("./end-session-dialog-view");

const plannedEndAt = new Date("2026-09-19T14:00:00Z");
const render = ({ pending, failed }: { pending: boolean; failed: boolean }) =>
  renderToStaticMarkup(
    createElement(EndSessionDialogView, {
      open: true,
      onOpenChange: vi.fn(),
      plannedEndAt,
      pending,
      failed,
      onConfirm: vi.fn(),
    }),
  );

describe("EndSessionDialogView", () => {
  it("기본: 제목·본문 두 줄·예정 종료와 solid primary [마치기]", () => {
    const html = render({ pending: false, failed: false });
    expect(html).toContain("[title:세션을 지금 마칠까요?]");
    expect(html).toContain("마치면 참여자 관리가 닫히고");
    expect(html).toContain("출석 확인으로 넘어갑니다.");
    expect(html).toContain("예정 종료 9월 19일 (토) 23:00");
    expect(html).toContain("[confirm:마치기|solid|primary|loading:false]");
    expect(html).not.toContain("세션을 마치지 못했습니다.");
  });

  it("처리 중: [마치기]가 loading이다", () => {
    expect(render({ pending: true, failed: false })).toContain(
      "[confirm:마치기|solid|primary|loading:true]",
    );
  });

  it("네트워크 오류: danger Callout과 [다시 시도]", () => {
    const html = render({ pending: false, failed: true });
    expect(html).toContain("세션을 마치지 못했습니다.");
    expect(html).toContain("잠시 뒤 다시 시도해 주세요.");
    expect(html).toContain("[confirm:다시 시도|solid|primary|loading:false]");
  });
});
