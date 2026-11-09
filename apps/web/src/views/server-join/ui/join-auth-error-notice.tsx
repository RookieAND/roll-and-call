"use client";

import { useEffect } from "react";

import { AUTH_ERROR_MESSAGE, type AuthError } from "@/shared/lib";
import { toast } from "@/shared/ui";

interface JoinAuthErrorNoticeProps {
  error: AuthError;
}

export function JoinAuthErrorNotice({ error }: JoinAuthErrorNoticeProps) {
  // toast id가 문구라 StrictMode에서 두 번 불려도 한 번만 보인다.
  useEffect(() => {
    toast.danger(AUTH_ERROR_MESSAGE[error]);
  }, [error]);
  return null;
}
