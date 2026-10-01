const normalize = (text: string) => text.replace(/\s+/g, "").toLowerCase();

export function isQuizAnswer({ answer, answers }: { answer: string; answers: string[] }) {
  const typed = normalize(answer);
  return typed !== "" && answers.some((candidate) => normalize(candidate) === typed);
}
