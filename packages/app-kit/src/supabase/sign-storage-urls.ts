import "server-only";
import { uniq } from "es-toolkit";

import { createSupabaseServerClient } from "./create-supabase-server-client";

const SIGNED_URL_SECONDS = 3600;

type SignStorageUrlsOptions = {
  bucket: string;
  keys: string[];
  pathOf: (key: string) => string | null;
  onError?: (message: string, detail?: unknown) => void;
};

// 로그인한 세션으로 저장소 파일에 서명 주소를 붙인다. 서명하지 못한 키(지워진 파일 등)는 맵에 없다.
export async function signStorageUrls({ bucket, keys, pathOf, onError }: SignStorageUrlsOptions) {
  const pathByKey = new Map(
    uniq(keys).flatMap((key) => {
      const path = pathOf(key);
      return path ? [[key, path] as const] : [];
    }),
  );
  if (pathByKey.size === 0) return new Map<string, string>();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(uniq([...pathByKey.values()]), SIGNED_URL_SECONDS);
  if (error) onError?.(error.message);
  const signedByPath = new Map(
    (data ?? []).flatMap((entry) => {
      if (entry.error) onError?.(entry.path ?? "", entry.error);
      return entry.error || !entry.path ? [] : [[entry.path, entry.signedUrl] as const];
    }),
  );
  return new Map(
    [...pathByKey].flatMap(([key, path]) => {
      const signedUrl = signedByPath.get(path);
      return signedUrl ? [[key, signedUrl] as const] : [];
    }),
  );
}
