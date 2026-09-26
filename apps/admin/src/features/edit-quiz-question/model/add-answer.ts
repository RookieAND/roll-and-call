// 표기가 다른 답을 여러 개 받는다. 공백·대소문자만 다른 답은 이미 있는 것으로 본다(채점도 둘을 무시한다).
const normalize = (answer: string) => answer.replace(/\s+/g, "").toLowerCase();

export function addAnswer(answers: string[], input: string) {
  const answer = input.trim();
  if (!answer || answers.some((existing) => normalize(existing) === normalize(answer))) {
    return answers;
  }
  return [...answers, answer];
}
