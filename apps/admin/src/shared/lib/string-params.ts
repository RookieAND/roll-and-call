import { isString, mapValues } from "es-toolkit";

type SearchParams = Record<string, string | string[] | undefined>;

// 같은 키가 두 번 붙은 주소(?q=a&q=b)의 배열 값은 없는 값으로 본다.
export function stringParams(params: SearchParams): Record<string, string | undefined> {
  return mapValues(params, (value) => (isString(value) ? value : undefined));
}
