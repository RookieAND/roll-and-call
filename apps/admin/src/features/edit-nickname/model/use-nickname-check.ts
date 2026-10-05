import { useEffect, useState } from "react";

import { checkNickname } from "../api/check-nickname";
import { followsNicknameRule, NICKNAME_RULE_ERROR } from "./nickname-rule";

const CHECK_DELAY_MS = 300;

export interface NicknameCheck {
  nickname: string;
  error: string | null;
}

// 입력이 멈추면 규칙(브라우저)과 중복(서버)을 확인한다. 확인이 끝난 닉네임과 결과를 함께 돌려줘 입력과 어긋난 결과를 쓰지 않게 한다.
export function useNicknameCheck({ userId, nickname }: { userId: string; nickname: string }) {
  const [check, setCheck] = useState<NicknameCheck | null>(null);
  useEffect(() => {
    if (!nickname) return;
    if (!followsNicknameRule(nickname)) {
      setCheck({ nickname, error: NICKNAME_RULE_ERROR });
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const error = await checkNickname({ userId, nickname });
      if (!cancelled) setCheck({ nickname, error });
    }, CHECK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userId, nickname]);
  return check?.nickname === nickname ? check : null;
}
