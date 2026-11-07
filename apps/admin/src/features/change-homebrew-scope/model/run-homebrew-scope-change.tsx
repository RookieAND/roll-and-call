import {
  HOMEBREW_SCOPE_LABEL,
  type HomebrewRuleScope,
} from "@roll-and-call/database/homebrew/model";
import { Button, toast } from "@roll-and-call/ui";
import { unstable_rethrow } from "next/navigation";

import { conflictToastText } from "@/shared/lib";

import { changeHomebrewScopeAction } from "../api/change-homebrew-scope-action";

interface RunHomebrewScopeChangeOptions {
  rulebookId: string;
  from: HomebrewRuleScope;
  to: HomebrewRuleScope;
  viewerId: string;
  refresh: () => void;
}

// 확인 창 없이 바로 바꾸고, 토스트의 [되돌리기]는 같은 변경을 반대로 다시 부른다.
export async function runHomebrewScopeChange(options: RunHomebrewScopeChangeOptions) {
  const { rulebookId, from, to, viewerId, refresh } = options;
  try {
    const result = await changeHomebrewScopeAction({ rulebookId, from, to });
    if (result.ok) {
      const message = `사용 범위를 ${HOMEBREW_SCOPE_LABEL[to]}으로 바꿨습니다.`;
      const undo = () => {
        toast.dismiss(message);
        void runHomebrewScopeChange({ ...options, from: to, to: from });
      };
      toast.success(message, {
        action: (
          <Button variant="tinted" size="sm" onClick={undo}>
            되돌리기
          </Button>
        ),
      });
      return;
    }
    if ("blocked" in result) {
      toast.info(result.blocked);
    } else {
      const { conflict } = result;
      toast.info(
        conflictToastText({ conflict, self: conflict?.byId === viewerId, target: "자작 룰" }),
      );
    }
    refresh();
  } catch (error) {
    unstable_rethrow(error);
    toast.danger("사용 범위를 바꾸지 못했습니다.", { description: "다시 시도해 주세요." });
  }
}
