// 이름 중복은 앞뒤·사이 공백과 대소문자를 무시하고 본다. SQL 쪽은 homebrewNameKeySql이 같은 규칙이다.
export function homebrewNameKey(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}
