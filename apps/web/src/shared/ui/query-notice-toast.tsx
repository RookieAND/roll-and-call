"use client";

import { toast } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { QUERY_NOTICE_PARAM, type QueryNotice } from "@/shared/lib";

interface QueryNoticeToastProps {
  messages: Partial<Record<QueryNotice, string>>;
}

// 주소의 notice 인자를 읽어 토스트를 한 번 띄우고 인자를 지운다. 새로 고쳐도 다시 뜨지 않는다.
export function QueryNoticeToast({ messages }: QueryNoticeToastProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const notice = searchParams.get(QUERY_NOTICE_PARAM);

  useEffect(() => {
    if (!notice) return;
    const message = messages[notice as QueryNotice];
    // toast id가 문구라 StrictMode에서 두 번 불려도 한 번만 보인다.
    if (message) toast.info(message);
    const rest = new URLSearchParams(searchParams);
    rest.delete(QUERY_NOTICE_PARAM);
    const query = rest.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [notice, messages, pathname, router, searchParams]);

  return null;
}
