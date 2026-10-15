"use client";

import { toast } from "@roll-and-call/ui";
import { compact, isUndefined, uniq } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { GrantOptions } from "@/entities/cert/server";
import { useActionSubmit } from "@/shared/lib";
import { useServerPath } from "@/shared/ui";

import { grantUserCertifications } from "../api/grant-user-certifications";
import { pruneBookSelection } from "../model/grant-book-selection";
import { grantMemberPlan } from "../model/grant-candidate-status";
import { grantResultToast } from "../model/grant-result-toast";

interface UseGrantCertificationOptions {
  options: GrantOptions;
  backHref: string;
}

// 인증 부여 폼의 선택·판정·확정. 데스크톱과 모바일 폼이 같이 쓴다.
export function useGrantCertification({ options, backHref }: UseGrantCertificationOptions) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(grantUserCertifications);
  const [bookIds, setBookIds] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [evidence, setEvidence] = useState("");

  const chosenBooks = options.books.filter((candidate) => bookIds.includes(candidate.id));
  const planOf = (userId: string, books: typeof chosenBooks) =>
    grantMemberPlan({ userId, books, options });
  const chosen = options.members.filter((member) => userIds.includes(member.id));
  const plans = chosen.map((member) => ({ member, plan: planOf(member.id, chosenBooks) }));
  // 부여할 룰북이 하나도 없는 유저는 확정 대상에서 뺀다. 고른 룰북이 있으면 인증 건수로 센다.
  const receiving = plans.filter(({ plan }) => plan.grantable.length > 0);
  const grantCount = receiving.reduce((sum, { plan }) => sum + plan.grantable.length, 0);
  const approving = plans.flatMap(({ member, plan }) =>
    plan.approving.map((book) => ({ nickname: member.nickname, label: book.label })),
  );
  const approvingNames = uniq(approving.map((row) => row.nickname));
  const canConfirm =
    chosenBooks.length > 0 && receiving.length > 0 && Boolean(evidence.trim()) && !pending;

  const changeBooks = (nextIds: string[]) => {
    const keptIds = pruneBookSelection({ selectedIds: nextIds, books: options.books });
    const next = options.books.filter((candidate) => keptIds.includes(candidate.id));
    // 고른 룰북이 바뀌어 부여할 책이 하나도 남지 않은 유저는 선택에서 뺀다.
    const keptUserIds = userIds.filter(
      (userId) => next.length === 0 || planOf(userId, next).grantable.length > 0,
    );
    setBookIds(keptIds);
    setUserIds(keptUserIds);
    // 조건을 잃어 선택에서 빠진 것은 말없이 사라지지 않게 알린다.
    const [title, description] = compact([
      nextIds.length > keptIds.length
        ? `서플리먼트 ${nextIds.length - keptIds.length}권을 선택에서 뺐습니다`
        : null,
      userIds.length > keptUserIds.length
        ? `부여할 룰북이 없는 유저 ${userIds.length - keptUserIds.length}명을 선택에서 뺐습니다`
        : null,
    ]);
    if (title) toast.info(title, { description });
  };

  const confirm = async () => {
    if (chosenBooks.length === 0) return;
    const result = await submit({
      rulebookIds: chosenBooks.map((book) => book.id),
      userIds: receiving.map(({ member }) => member.id),
      evidence,
    });
    if (isUndefined(result)) return;
    if (!result.ok) {
      toast.danger(result.error);
      return;
    }
    const outcome = grantResultToast(result);
    if (!outcome.success) {
      toast.info(outcome.title);
      router.refresh();
      return;
    }
    router.push(toServerPath(backHref));
    toast.success(outcome.title, { description: outcome.description });
  };

  return {
    pending,
    networkError,
    bookIds,
    userIds,
    evidence,
    chosenBooks,
    chosen,
    receiving,
    grantCount,
    approving,
    approvingNames,
    canConfirm,
    changeBooks,
    setUserIds,
    setEvidence,
    confirm,
  };
}
