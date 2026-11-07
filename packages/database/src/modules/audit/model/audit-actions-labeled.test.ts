import { describe, expect, it } from "vitest";

import { auditActionLabel } from "./audit-action-label";
import { auditActionsLabeled } from "./audit-actions-labeled";

describe("auditActionsLabeled", () => {
  it("이름이 바뀐 옛 값을 함께 고르고, 옛 값 자체를 이름으로 주면 고르지 않는다", () => {
    expect(auditActionsLabeled(["서버 설정 변경", "제재"]).toSorted()).toEqual(
      ["서버 설정 변경", "설정 변경", "제재"].toSorted(),
    );
    expect(auditActionsLabeled(["설정 변경"])).toEqual([]);
    for (const action of auditActionsLabeled(["서버 설정 변경"])) {
      expect(auditActionLabel(action)).toBe("서버 설정 변경");
    }
  });
});
