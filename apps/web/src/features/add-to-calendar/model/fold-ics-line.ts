const MAX_OCTETS = 75;
const encoder = new TextEncoder();

// 한 줄을 75옥텟 안으로 접는다. 이어지는 줄은 공백 하나로 시작하고 그 공백도 75옥텟에 든다.
// 글자 단위로 세어 UTF-8 한 글자를 가운데서 자르지 않는다.
export function foldIcsLine(line: string) {
  const lines: string[] = [];
  let current = "";
  let octets = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    const limit = lines.length === 0 ? MAX_OCTETS : MAX_OCTETS - 1;
    if (octets + size > limit) {
      lines.push(current);
      current = "";
      octets = 0;
    }
    current += character;
    octets += size;
  }
  lines.push(current);
  return lines.join("\r\n ");
}
