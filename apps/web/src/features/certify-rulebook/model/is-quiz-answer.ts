const normalize = (text: string) => text.replace(/\s+/g, "").toLowerCase();

// 본문 퀴즈 답이 맞는지. 공백과 대소문자는 가리지 않는다.
export function isQuizAnswer({ answer, answers }: { answer: string; answers: string[] }) {
  const typed = normalize(answer);
  return typed !== "" && answers.some((candidate) => normalize(candidate) === typed);
}
