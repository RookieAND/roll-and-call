import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { NotificationPreview } from "./notification-preview";

describe("NotificationPreview", () => {
  it("알림 줄을 달력 아이콘, 굵은 제목, 사유 보조 줄, 「방금」으로 그린다", () => {
    const html = renderToStaticMarkup(
      <NotificationPreview
        payload={{
          kind: NOTIFICATION_KIND.gameHidden,
          params: { gameId: "1", gameTitle: "붉은 여관의 밤", reason: "부적절한 이미지" },
        }}
        recipients="당사자와 GM에게 알립니다."
      />,
    );
    expect(html).toContain("당사자의 알림 탭에 이렇게 보입니다");
    expect(html).toContain("lucide-calendar-days");
    expect(html).toMatch(/<strong[^>]*>붉은 여관의 밤<\/strong>/);
    expect(html).toContain("사유: 부적절한 이미지");
    expect(html).toContain("방금");
    expect(html).toContain("당사자와 GM에게 알립니다.");
  });

  it("payload가 없으면 emptyText를 보인다", () => {
    const html = renderToStaticMarkup(<NotificationPreview payload={null} />);
    expect(html).toContain("사유를 고르면 알림 미리보기가 표시됩니다.");
    expect(html).not.toContain("방금");
  });
});
