const LISTED_NAME_LIMIT = 2;

// 「오세진」, 「오세진, 정민서」, 「오세진 외 2인」.
export function abbreviatedNames(names: string[]): string {
  return names.length > LISTED_NAME_LIMIT
    ? `${names[0]} 외 ${names.length - 1}인`
    : names.join(", ");
}
